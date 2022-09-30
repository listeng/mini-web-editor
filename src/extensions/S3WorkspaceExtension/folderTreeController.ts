import molecule from '@dtinsight/molecule';
import { Float, IFolderTreeNodeProps } from '@dtinsight/molecule/esm/model';
import { transformToEditorTab } from '../../common';
import { saveFileMenuItem } from './base';
import { message, Modal } from 'antd';

import { STATUS_BAR_LANGUAGE } from './base';
import { Stream } from 'stream';

var Minio = require("minio");

var fileMaps: Record<string, any> = {
    "json": {
        "icon": "codicon codicon-json",
        "language": "json",
    },
    "geojson": {
        "icon": "codicon codicon-json",
        "language": "json",
    },
    "txt": {
        "icon": "codicon codicon-file",
        "language": "txt",
    },
    "js": {
        "icon": "codicon codicon-file-code",
        "language": "javascript",
    },
    "css": {
        "icon": "codicon codicon-file-code",
        "language": "css",
    },
    "html": {
        "icon": "codicon codicon-file-code",
        "language": "html",
    },
    "aspx": {
        "icon": "codicon codicon-file-code",
        "language": "c#",
    },
    "ashx": {
        "icon": "codicon codicon-file-code",
        "language": "c#",
    },
    "py": {
        "icon": "codicon codicon-file-code",
        "language": "python",
    },
};

console.log(process.env);

var minioClient = new Minio.Client({
    endPoint: process.env["REACT_APP_MINIO_ENDPOINT"],
    port: Number(process.env["REACT_APP_MINIO_PORT"]),
    useSSL: process.env["REACT_APP_MINIO_SSL"] === 'true',
    accessKey: process.env["REACT_APP_MINIO_AK"],
    secretKey: process.env["REACT_APP_MINIO_SK"]
});

var bucket = process.env["REACT_APP_MINIO_BUCKET"];

function buildIcon(name: string): string {
    var n = name.toLowerCase();

    for (var x in fileMaps) {
        if (n.endsWith('.' + x)) {
            return fileMaps[x].icon;
        }
    }

    return 'codicon codicon-file-binary';
}

function buildLang(name: string): string {
    var n = name.toLowerCase();

    for (var x in fileMaps) {
        if (n.endsWith('.' + x)) {
            return fileMaps[x].language;
        }
    }

    return 'bin';
}

function buildFileTree(bucket: string, files: any[]): any {
    var idx = 0;
    var root = {
        id: idx++,
        name: bucket,
        fileType: "RootFolder",
        location: bucket,
        isLeaf: false,
        children: Array<any>()
    };

    let result: any[] = [];
    let level = {result};

    files.forEach(path => {
        path.name.split('/').reduce((r: any, name: string, _i: any, _a: any) => {
          if(!r[name]) {
            r[name] = {result: []};

            var type = _a.length > 1 ? (_i < _a.length - 1 ? 'Folder': 'File'): 'File';
            r.result.push({
                id: idx++,
                icon: type === 'Folder' ? '': buildIcon(name),
                fileType: type,
                location: _a.slice(0, _i+1).join('/'),
                isLeaf: type === 'Folder' ? false: true,
                name, 
                children: r[name].result
            })
          }
          
          return r[name];
        }, level);
      });

    root.children = result;

    return root;
}

export function handleSaveFile() {
    molecule.menuBar.append(saveFileMenuItem, 'File');

    molecule.menuBar.onSelect((menuId) => {
        if (menuId === saveFileMenuItem.id) {

            const currentTask = molecule.editor.getState().current?.tab;
            if (!currentTask) return message.success('保存失败！');

            const data = currentTask.data;
            console.log(currentTask);

            minioClient.putObject(bucket, data.path, data.value,
              (err: any, objInfo: any) => {
                if(err) {
                    return console.log(err) // err should be null
                }
                molecule.editor.updateTab({ id: currentTask.id, status: undefined });

                message.success('保存成功！');
            })

            
        }
    });
}

export function initFolderTree () {
    var files: any[] = [];
    var stream: Stream = minioClient.listObjectsV2(bucket,'', true,'')
    stream.on('data', (obj: any) => {
        files.push(obj);
    })
    stream.on("end", (obj: any) => {
        molecule.folderTree.add(buildFileTree(bucket!, files));
    })
    stream.on('error', function(err: any) { console.log(err) } )
}

export function handleSelectFolderTree() {
    molecule.folderTree.onSelectFile((file: IFolderTreeNodeProps) => {
        var filename = file.name || '';
        var filetype = buildLang(filename);
        var location = file.location;

        if (filetype !== 'bin') {
            minioClient.getObject(bucket!, file.location, (err: any, dataStream: Stream) => {
                if (err) {
                return console.log(err)
                }

                const streamToString = (stream: Stream) =>
                    new Promise((resolve, reject) => {
                    const chunks: any[] = [];
                    stream.on("data", (chunk) => chunks.push(chunk));
                    stream.on("error", reject);
                    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
                });

                streamToString(dataStream).then((result) => {

                    console.log(location);
                    
                    file.data = {
                        language: filetype, 
                        value: result
                    };
                    molecule.editor.open(transformToEditorTab(file));
                    updateStatusBarLanguage(file.data.language);
                });
            })

        } else {
            file.data = {
                language: filetype, 
                value: "！不支持的文件类型！"
            };
            molecule.editor.open(transformToEditorTab(file));
            updateStatusBarLanguage(file.data.language);
        }
    });
}

export function updateStatusBarLanguage(language: string) {
    if (!language) return;
    language = language.toUpperCase();
    const languageStatusItem = molecule.statusBar.getStatusBarItem(STATUS_BAR_LANGUAGE.id, Float.right);
    if (languageStatusItem) {
        languageStatusItem.name = language;
        molecule.statusBar.update(languageStatusItem, Float.right);
    } else {
        molecule.statusBar.add(Object.assign({}, STATUS_BAR_LANGUAGE, { name: language } ), Float.right);
    }
}

export function handleStatusBarLanguage() {
    const moleculeEditor = molecule.editor;
    moleculeEditor.onSelectTab((tabId, groupId) => {
        if (!groupId) return;
        const group = moleculeEditor.getGroupById(groupId);
        if (!group) return;
        const tab: any = moleculeEditor.getTabById(tabId, group.id!);
        if (tab) {
            updateStatusBarLanguage(tab.data!.language!);
        }
    })
}
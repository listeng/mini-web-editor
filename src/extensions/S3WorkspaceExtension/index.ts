
import molecule from '@dtinsight/molecule';
import { IExtension } from '@dtinsight/molecule/esm/model/extension';
import { IExtensionService } from '@dtinsight/molecule/esm/services';
import * as folderTreeController from './folderTreeController';
import * as searchPaneController from './searchPaneController';


var Minio = require("minio");

export class S3WorkspaceExtension implements IExtension {

    id: string = '';
    name: string = '';

    constructor(
        id: string = 'TheFirstExtension', 
        name: string = 'The First Extension'
    ) {
        this.id = id;
        this.name = name;
    }

    activate(extensionCtx: IExtensionService): void {
        folderTreeController.initFolderTree();
        folderTreeController.handleSelectFolderTree();
        folderTreeController.handleStatusBarLanguage();
        folderTreeController.handleSaveFile();
        searchPaneController.handleSearchEvent();
        searchPaneController.handleSelectSearchResult();

        

        molecule.editor.onUpdateTab((tab) => {
            molecule.editor.updateTab({ id: tab.id, status: 'edited' });
        })

        // molecule.editor.onCloseTab((tabId, groupId) => {
        //     console.log(tabId);
        //     if (!groupId) return;
        //     const group = molecule.editor.getGroupById(groupId);
        //     if (!group) return;
        //     const tab: any = molecule.editor.getTabById(tabId, group.id!);
        //     if (tab) {
        //         console.log(tab.status);

        //         Modal.confirm({
        //             title: 'Confirm',
        //             content: '文件已修改，确认关闭吗？',
        //             okText: '确认',
        //             cancelText: '取消',
        //         });
        //     }
        // })
    }

    dispose(extensionCtx: IExtensionService): void {
        throw new Error('Method not implemented.');
    }
}
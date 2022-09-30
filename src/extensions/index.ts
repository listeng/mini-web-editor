import { IExtension } from '@dtinsight/molecule/esm/model';
import { S3WorkspaceExtension } from './S3WorkspaceExtension';
import { ExtendLocales } from './i18n';
import { MenuBarExtension } from './menubar/index';

const extensions: IExtension[] = [
    new S3WorkspaceExtension(),
    new MenuBarExtension(),
    ExtendLocales,

];

export default extensions;
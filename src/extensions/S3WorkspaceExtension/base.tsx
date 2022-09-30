import { IStatusBarItem, IMenuBarItem } from '@dtinsight/molecule/esm/model';
import { localize } from '@dtinsight/molecule/esm/i18n/localize';

export const STATUS_BAR_LANGUAGE: IStatusBarItem = {
    id: 'LanguageStatus',
    sortIndex: 3,
}

export const openWorkspaceMenuItem: IMenuBarItem = {
    id: 'menu.openWorkspace',
    name: localize('menu.openWorkspace', 'Open Workspace'),
    icon: ''
}

export const saveFileMenuItem: IMenuBarItem = {
    id: 'menu.saveFile',
    name: localize('menu.saveFile', 'Save'),
    icon: ''
}
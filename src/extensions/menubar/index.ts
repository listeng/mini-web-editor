
import molecule from '@dtinsight/molecule';
import { IExtension } from '@dtinsight/molecule/esm/model';
import { IExtensionService } from '@dtinsight/molecule/esm/services';

export class MenuBarExtension implements IExtension {

    id: string = 'MyMenubar';
    name: string = 'MyMenu Bar';

    activate(extensionCtx: IExtensionService): void {
        this.initUI();
    }

    initUI() {
        const { data } = molecule.menuBar.getState();
        const nextData = data.concat();
        // nextData.push(saveMenuItem);

        molecule.menuBar.setState({ data: nextData });
        
        molecule.layout.setMenuBarMode('horizontal');
    }

    dispose() {
        molecule.menuBar.reset();
    }
}
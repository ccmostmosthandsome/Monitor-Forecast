'use strict'

import Menu, {SubMenu, MenuItem} from 'rc-menu';

const rcMenuContainer = document.querySelector('#rc_menu');
ReactDOM.render(<Menu>
    <MenuItem> 1 </MenuItem>
    <SubMenu
        title="2">
        <MenuItem> 2 - 1 </MenuItem>
    </SubMenu>
</Menu>, rcMenuContainer);


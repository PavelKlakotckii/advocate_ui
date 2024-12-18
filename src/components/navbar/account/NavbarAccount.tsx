import React, {memo, useCallback, useState} from "react";
import styles from "./NavbarAccount.module.sass";
import { IoSettingsOutline } from "react-icons/io5";
import { BsChevronDown } from "react-icons/bs";
import {Link, useLocation, useNavigate} from "react-router-dom";
import classNames from "classnames";
import {Dropdown, MenuProps} from "antd";
import { IoLogOutOutline } from "react-icons/io5";

enum AccountMenuItems {
    logout = 'logout'
}

const NavbarAccount = memo(() => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

    const items: MenuProps['items'] = [
        {
            label: <span>что-то улетное</span>,
            key: '1',
        },
        {
            type: 'divider',
        },
        {
            icon: <IoLogOutOutline size={16} />,
            label: 'Выйти',
            key: AccountMenuItems.logout,
        },
    ];

    const onClick: MenuProps['onClick'] = ({ key }) => {
        if (key === AccountMenuItems.logout) {
            // --> logout
            navigate('/')
        }
    };

    const handleOpenChange = useCallback((value: boolean) => {
        setIsDropdownOpen(value)
    }, [])

    return (
        <div className={styles['navbar-account']}>
            <Dropdown onOpenChange={handleOpenChange} menu={{ items, onClick }} trigger={['click']}>
                <div className={classNames(styles['account-name'], isDropdownOpen && styles['_active'])}>
                    <div>Пувел Диареевич</div>
                    <BsChevronDown size={10} />
                </div>
            </Dropdown>
            <Link
                to={'/account/settings'}
                className={classNames(
                    styles['account-settings'],
                    location.pathname === '/account/settings' && styles['_active']
                )}
            >
                <IoSettingsOutline size={16} />
            </Link>
        </div>
    )
})

export default NavbarAccount
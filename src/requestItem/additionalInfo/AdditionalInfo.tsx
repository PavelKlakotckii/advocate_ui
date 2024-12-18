import React, {useCallback, useEffect, useState} from "react";
import styles from "./AdditionalInfo.module.sass";
import {StatusV2} from "../../mainPageSections/mainPage/MainPage";
import {Dropdown, MenuProps, Tag} from "antd";
import { DownOutlined } from '@ant-design/icons';

interface InfoRow {
    name: string;
    value: string | JSX.Element;
}

const MOCK_ADD_CLAIM_INFO = {
    id: '120',
    status: StatusV2.inProcess,
    author: 'Пувел Диареевич',
    institution: 'Роспотребнадзор',
    createdDate: '01.07.2023 10:20',
    lastUpdate: '01.07.2023 в 19:30'
}

const AdditionalInfo = () => {
    const [rows, setRows] = useState<InfoRow[]>(null);

    useEffect(() => {
        createInfoRows();
    }, [])

    const createInfoRows = useCallback(() => {
        const info = MOCK_ADD_CLAIM_INFO;
        const resultRows: InfoRow[] = [];
        for (let field in info) {
            if (field === 'id') {
                resultRows.push({name: 'Номер', value: info[field]})
            }
            if (field === 'status'){
                resultRows.push({name: 'Статус', value: renderStatusTag(info[field])})
            }
            if (field === 'author') {
                resultRows.push({name: 'Автор', value: info[field]})
            }
            if (field === 'institution') {
                resultRows.push({name: 'Учреждение', value: info[field]})
            }
        }

        setRows(resultRows);
    }, [])

    const renderStatusTag = (status: string, className?: string, children?: JSX.Element): JSX.Element => {
        switch (status) {
            case StatusV2.resolved: {
                return (
                    <Tag color='green' className={className}>
                        Готово
                        {children}
                    </Tag>
                )
            }
            case StatusV2.decline: {
                return (
                    <Tag color='volcano' className={className}>
                        Отклонено
                        {children}
                    </Tag>
                )
            }
            case StatusV2.new: {
                return (
                    <Tag color='geekblue' className={className}>
                        Создано
                        {children}
                    </Tag>
                )
            }
            case StatusV2.inProcess: {
                return (
                    <Tag color='blue' className={className}>
                        В процессе
                        {children}
                    </Tag>
                )
            }
            case 'NEED_INFO':
            case StatusV2.waitingForAction: {
                return (
                    <Tag color='orange' className={className}>
                        Требуется действие
                        {children}
                    </Tag>
                )
            }
            default: return (
                <Tag color='geekblue' className={className}>
                    {status}
                    {children}
                </Tag>
            )
        }
    }

    const renderRow = (name: string, value: string | JSX.Element) => {
        if (!name || !value) return null;
        return (
            <div key={name} className={styles.info_row}>
                <div className={styles.row_name}>{name}</div>
                <div className={styles.row_value}>{value}</div>
            </div>
        )
    }

    const handleMenuClick: MenuProps['onClick'] = (e) => {
        console.log('click', e);
    };

    const items: MenuProps['items'] = [
        {
            label: 'В процессе',
            key: '1',
            disabled: true,
        },
        {
            label: 'Решено',
            key: '2',
            danger: true,
        },
    ];

    const menuProps = {
        items,
        onClick: handleMenuClick,
    };

    if (!rows || !rows.length) return null;

    return (
        <div className={styles.additional_info}>
            <div className={styles.change_status}>
                <Dropdown menu={menuProps} trigger={['click']}>
                    {renderStatusTag(MOCK_ADD_CLAIM_INFO.status, styles.dropdown_tag, (
                        <DownOutlined className={styles.dropdown_icon} />
                    ))}
                </Dropdown>
            </div>
            <div className={styles.add_caption}>Сведения</div>
            <div className={styles.add_body}>
                {rows.map((row) => (
                    renderRow(row.name, row.value)
                ))}
                {[1,2,3,4,5,6,7,8].map(item => (
                    <div key={item}>поле</div>
                ))}
            </div>
            <div className={styles.date_block}>
                <div>Создано {MOCK_ADD_CLAIM_INFO.createdDate}</div>
                <div>Последнее обноление {MOCK_ADD_CLAIM_INFO.lastUpdate}</div>
            </div>
        </div>
    )
}

export default AdditionalInfo

import React, {useCallback, useEffect, useState} from "react";
import {useParams} from "react-router";
import CenterContent from "../components/centerContent/CenterContent";
import MainWrapper from "../components/mainWrapper/MainWrapper";
import styles from "./RequestItem.module.sass";
import ClaimActions from "./claimActions/ClaimActions";
import AdditionalInfo from "./additionalInfo/AdditionalInfo";
import getClaimsRequest from "../mainPageSections/api/metods/getClaimsRequest";
import {ClaimsItemResponse} from "../mainPageSections/api/requests/GetClaimsRequest";

const CAPTION = 'Читос или кузя лакомкин?';
const ITEM_DESCRIPTION = 'Многие меня спрашивают читос или кузя лакомкин. Скажу по секрету, что между ними стоит еще один титан. Это русская картошка. ' +
    'Базарю. Под пивас вообще четко залетает, тает во рту, каеф. Будто девчонку первый раз попробовал. И к слову жизнь как рюкзак нагруженный пивом - чем больше пьешь пиво тем тебе легче. Главное перед мамой не спалиться'

const RequestItem = () => {
    const {id} = useParams();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [data, setData] = useState<ClaimsItemResponse>(null);

    useEffect(() => {
        console.log('id', id)
        requestClaims();
    }, [id])

    const requestClaims = useCallback(async () => {
        const sessionId = localStorage.getItem('id');
        if (!sessionId) return;
        try {
            const response = await getClaimsRequest(sessionId);
            if (response) {
                console.log('res', response);
                const requiredData = response.claims.find((claim) => claim.genId === id);
                setData(requiredData);
                setIsLoading(false);
            }
        } catch (err) {
            console.log('err')
            setIsLoading(false);
        }
    }, [id])

    const renderLoader = () => {
        return (
            <div>loader</div>
        )
    }

    if (!data) return null;

    return isLoading && !data ? renderLoader() : (
        <MainWrapper>
            <CenterContent>
                <div className={styles.main_info}>
                    <div className={styles.form}>
                        <div className={styles.caption}>{data.name}</div>
                        <div className={styles.description}>Описание</div>
                        <div className={styles.description_text}>{data.text}</div>
                        <div className={styles.attachments}>Вложения</div>
                        <div className={styles.attachment_items}>
                            <div className={styles.attach_item}>
                                .doc
                            </div>
                            <div className={styles.attach_item}>
                                .pdf
                            </div>
                        </div>
                    </div>
                    <div className={styles.actions}>
                        <div className={styles.title}>Активность</div>
                        {data.comments.length ? (
                            <ClaimActions actions={data.comments} id={id}/>
                        ) : (
                            <div className={styles.no_activities}>Нет активности</div>
                        )}
                    </div>
                </div>
                <AdditionalInfo />
            </CenterContent>
        </MainWrapper>
    )
}
export default RequestItem;
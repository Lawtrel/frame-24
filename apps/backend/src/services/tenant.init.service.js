import logger from "../utils/logger.js";
import {
    contractTypeData, profileData, revenueTypeData, paymentMethodData,
    saleTypeData, saleStatusData, ticketTypeData, ageRatingData,
    projectionTypeData, audioTypeData, sessionLanguageData,
    sessionStatusData, seatStatusData, seatTypeData,
    movieCategoryData, castTypeData, mediaTypeData,
    accountTypeData, accountNatureData,
    taxRegimeData, pisCofinsRegimeData
} from '../data/tenant-data.js';


const initialDataMap = {
    access_profiles: profileData,
    employment_contract_types: contractTypeData,
    revenue_types: revenueTypeData,
    payment_methods: paymentMethodData,
    sale_types: saleTypeData,
    sale_status: saleStatusData,
    ticket_types: ticketTypeData,
    age_ratings: ageRatingData,
    projection_types: projectionTypeData,
    audio_types: audioTypeData,
    session_languages: sessionLanguageData,
    session_status: sessionStatusData,
    seat_status: seatStatusData,
    seat_types: seatTypeData,
    movie_categories: movieCategoryData,
    cast_types: castTypeData,
    media_types: mediaTypeData,
    account_types: accountTypeData,
    account_natures: accountNatureData,
    tax_regimes: taxRegimeData,
    pis_cofins_regimes: pisCofinsRegimeData
};


const insertTenantData = async (tx, modelName, dataArray, companyId) => {
    if (!dataArray || dataArray.length === 0) return;

    logger.info(`  ... Inicializando ${modelName} (${dataArray.length} registros)`);

    const recordsToCreate = dataArray.map(item => ({
        ...item,
        company_id: companyId
    }));

    const promises = recordsToCreate.map(data => tx[modelName].create({ data }));

    await Promise.all(promises);
};



export const initializeTenantData = async (tx, companyId) => {
    logger.info(`Iniciando inicialização de dados para o Tenant ID: ${companyId}`);

    for (const modelName in initialDataMap) {
        const dataArray = initialDataMap[modelName];
        await insertTenantData(tx, modelName, dataArray, companyId);
    }

    logger.info(`✅ Inicialização de dados do Tenant ID: ${companyId} concluída.`);
};
import { CoinsQueryConvertor } from '../../shared/Convertors';

export const CoinsValidator = (value: string) => {
    return CoinsQueryConvertor(value);
};

export const DateValidator = (value: string) => {
    const dateSeparat = value.split('/');
    return !(
        dateSeparat.length != 3 &&
        Number.isNaN(dateSeparat[0]) &&
        Number.isNaN(dateSeparat[1]) &&
        Number.isNaN(dateSeparat[2])
    );
};

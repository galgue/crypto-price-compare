export const CoinsQueryConvertor = (value: string) =>
    value.split(',').filter((coin) => coin != '');

export const DateQueryConvertor = (value: string) => {
    const dateSeperator = value.split('/');

    return new Date(
        Number(dateSeperator[2]),
        Number(dateSeperator[1]) - 1,
        Number(dateSeperator[0])
    );
};

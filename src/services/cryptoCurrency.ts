import 'reflect-metadata';
import axios from 'axios';
import { CoinValues } from '../interfaces/CoinValues';
import { NewCryptoValueResponse } from '../interfaces/NowResponse';
import { OldCryptoValueResponse } from '../interfaces/OldCryptoValueResopnse';
import { createDateFormat } from '../shared/Functions';
import { Service } from 'typedi';

@Service()
export class CryptoCurrencySevice {
    async getCryptoCurrencyChange(cryptos: string[], toDate: Date) {
        if (cryptos.length === 0) {
            return '';
        }

        const nowValues = await this.getNowPrices(cryptos);

        const oldValues = await this.getOldPrices(
            Object.keys(nowValues),
            toDate
        );

        const changes = this.getCoinsChange(nowValues, oldValues);

        return changes;
    }

    private async getNowPrices(cryptos: string[]): Promise<CoinValues> {
        const res = await axios.get<NewCryptoValueResponse>(
            `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${cryptos.join(
                ','
            )}&tsyms=USD`
        );

        let coinValues: { [name: string]: number } = {};
        Object.entries(res.data).forEach((crypto) => {
            coinValues[crypto[0]] = crypto[1].USD;
        });

        return coinValues;
    }

    private async getOldPrices(
        cryptos: string[],
        toDate: Date
    ): Promise<CoinValues> {
        const nextDay = new Date(toDate.getTime());
        nextDay.setDate(nextDay.getDate() + 1);
        const oldDate = createDateFormat(nextDay);

        let coinValues: { [name: string]: number } = {};

        await Promise.all(
            cryptos.map((cry) =>
                axios
                    .get<OldCryptoValueResponse>(
                        `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${cry}&tsym=USD&limit=1&toTs=${oldDate}`
                    )
                    .then((res) => {
                        coinValues[cry] = res.data.Data.Data[1].high;
                    })
            )
        );

        return coinValues;
    }

    private getCoinsChange(
        nowValues: CoinValues,
        oldValues: CoinValues
    ): CoinValues {
        const changes = {};

        Object.keys(oldValues).forEach((coin) => {
            const oldValue = oldValues[coin];
            const nowValue = nowValues[coin];

            changes[coin] =
                (nowValue > oldValue
                    ? nowValue / oldValue - 1
                    : -oldValue / nowValue + 1) * 100;
        });

        return changes;
    }
}

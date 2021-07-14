
import {Router} from 'express';
import { query, validationResult } from 'express-validator';
import { CryptoCurrencySevice } from '../services/cryptoCurrency';
import { CoinsQueryConvertor, DateQueryConvertor } from '../shared/Convertors';
import { CoinsValidator } from './validators';
import { DateValidator } from './validators/Coins';
import { Container } from 'typedi';


export const cryptoChangesRoute = () => {

  const cryptoCurrencySevice = Container.get(CryptoCurrencySevice);
  
  const router = Router();

  router.get(
      '/price-changes',
      query('coins', 'coin is missing from query parameter').custom(CoinsValidator).withMessage('coins format is not correct'),
      query('date', 'date is missing from query parameter').custom(DateValidator).withMessage('date format is not correct'),
      async (req, res) => {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
          }
  
          const coins = CoinsQueryConvertor(req.query.coins);
          const date = DateQueryConvertor(req.query.date);
  
          return res.status(200).json(await cryptoCurrencySevice.getCryptoCurrencyChange(coins, date));
          
        }
  )

  return router;
} 
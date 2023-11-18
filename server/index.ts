import { createClient } from '@supabase/supabase-js';
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import auth from '../server/middleware/auth';

// Load environment variables
dotenv.config();

const port = process.env.PORT || 8000;
const app: Express = express();

const dbUrl = process.env.DB_URL;
const apiKey = process.env.API_KEY;

let supabase: any;
if (dbUrl !== undefined && apiKey !== undefined) {
    supabase = createClient(dbUrl, apiKey);
}

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello from the server');
});

// apply auth to protected backend routes
app.put('/setNickname', auth, async (req: Request, res: Response) => {
    console.log('body:', req.body);
    const { data, error } = await supabase.from('profiles').update({ username: req.body.username }).eq('id', req.body.uid);
    const response = {
        'data ': data,
        ' error ': error,
    };
    res.json(response);
});

app.get('/products', async (req: Request, res: Response) => {
    const { data, error } = await supabase.from('products').select();
    res.json(data);
});

// apply auth to protected backend routes
app.post('/products', auth, async (req: Request, res: Response) => {
    console.log('body:', req.body.product_name);
    const { data, error } = await supabase.from('products').insert({ product_name: req.body.product_name });
    if (!error) res.json('success');
    else res.send('error');
});

app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});

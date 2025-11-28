import { NextResponse } from 'next/server';
import { connectToDb } from '../../../../lib/server/connection';

export async function GET(req) {
    try {
        const client = await connectToDb();
        const db = client.db('Heatz');
        const productsCollection = db.collection('Products');

        const products = await productsCollection.find({}).toArray();

        client.close();

        return NextResponse.json({ products }, { status: 200 });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}

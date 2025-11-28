import { NextResponse } from 'next/server';
import { connectToDb } from '../../../../../lib/server/connection';

export async function GET(req) {
    try {
        const client = await connectToDb();
        const db = client.db('Heatz');
        const productsCollection = db.collection('Products');

        const featuredProducts = await productsCollection.find({ featured: true }).toArray();

        client.close();

        return NextResponse.json({ products: featuredProducts }, { status: 200 });
    } catch (error) {
        console.error('Error fetching featured products:', error);
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const { productId, featured } = await req.json();

        if (!productId || typeof featured !== 'boolean') {
            return NextResponse.json({ error: 'Invalid request data.' }, { status: 400 });
        }

        const client = await connectToDb();
        const db = client.db('Heatz');
        const productsCollection = db.collection('Products');

        const result = await productsCollection.updateOne(
            { _id: productId },
            { $set: { featured } }
        );

        client.close();

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Product updated successfully.' }, { status: 200 });
    } catch (error) {
        console.error('Error updating featured status:', error);
        return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
    }
}

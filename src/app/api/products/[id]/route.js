import { NextResponse } from 'next/server';
import { connectToDb } from '../../../../../lib/server/connection';
import { ObjectId } from 'mongodb';
import { deleteFromCloudinary } from '../../../../../lib/server/cloudinaryHelper';

export async function GET(req, { params }) {
  const productId = params.id;

  if (!ObjectId.isValid(productId)) {
    return NextResponse.json({ error: 'Invalid product ID.' }, { status: 400 });
  }

  try {
    const client = await connectToDb();
    const db = client.db('Heatz');
    const productsCollection = db.collection('Products');

    const product = await productsCollection.findOne({ _id: new ObjectId(productId) });
    client.close();

    if (!product) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const productId = params.id;

  if (!ObjectId.isValid(productId)) {
    return NextResponse.json({ error: 'Invalid product ID.' }, { status: 400 });
  }

  try {
    const client = await connectToDb();
    const db = client.db('Heatz');
    const productsCollection = db.collection('Products');

    const product = await productsCollection.findOne({ _id: new ObjectId(productId) });

    if (!product) {
      client.close();
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    if (product.imageUrls?.length > 0) {
      await Promise.all(
        product.imageUrls.map(async (imageUrl) => {
          try {
            await deleteFromCloudinary(imageUrl, 'products');
          } catch (cloudinaryError) {
            console.error(`Error deleting image from Cloudinary (${imageUrl}):`, cloudinaryError);
          }
        })
      );
    }

    const result = await productsCollection.deleteOne({ _id: new ObjectId(productId) });
    client.close();

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Failed to delete product.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product and associated images deleted successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
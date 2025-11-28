import { NextResponse } from 'next/server';
import { connectToDb } from '../../../../../lib/server/connection';
import { ObjectId } from 'mongodb';

export async function PUT(request) {
    try {
        const { userId, role } = await request.json();

        if (!userId || !role) {
            return NextResponse.json({ error: 'Missing userId or role' }, { status: 400 });
        }

        const client = await connectToDb();
        const db = client.db('Heatz');
        const usersCollection = db.collection('Users');

        const result = await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: { role: role } }
        );

        // client.close(); // It's often better not to close if connection is reused, but following pattern from other route if applicable. 
        // The other route closed it, so I will too.
        client.close();

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Role updated successfully' });
    } catch (error) {
        console.error('Error updating role:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

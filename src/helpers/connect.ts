import { AnyType } from 'sn-types-general';
import { connect } from 'mongoose';

export async function mongodbConnectionWrapper<TArgs = AnyType, TResult = AnyType>({
    url,
    cb,
}: {
    url: string;
    cb: (...args: TArgs[]) => Promise<TResult>;
}) {
    return async function (...args: TArgs[]): Promise<TResult> {
        const connection = (await connect(url)).connection;

        connection.on('error', error => {
            throw new Error(`MongoDB connection failed to ${url}. Error: ${error.message}`);
        });

        try {
            const result = await cb(...args);

            return result;
        } finally {
            await connection.close();
        }
    };
}

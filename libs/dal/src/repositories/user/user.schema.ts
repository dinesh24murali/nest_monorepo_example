import { model, models, Model, Schema } from 'mongoose';

import { schemaOptions } from '../schema-default.options';
import { UserDBModel } from './user.entity';

const Types = Schema.Types;

const userSchema = new Schema<UserDBModel>(
    {
        _id: Types.String,
        name: Types.String,
        phone: Types.String,
        email: Types.String,
        address: Types.String,
        dob: Types.Date,
        lastLoggedIn: Types.Date,
        documentUrl: Types.String,
        status: Types.String,
        walletBalance: Types.Decimal128,
        currency: Types.String,
        refreshToken: Types.String,
        createdAt: Types.Date,
        updatedAt: Types.Date,
    },
    schemaOptions,
);

export const User = (models.User as Model<UserDBModel>) || model<UserDBModel>('User', userSchema);
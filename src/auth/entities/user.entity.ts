import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class User {

    //_id: string; -> This is created in mongo automatically
    @Prop( { unique: true, required: true } )
    email: string;

    @Prop({ required: true })
    name: string;

    @Prop( { minlength: 6, required: true } )
    password?: string; // It's optional because we don't want to return the password to the client

    @Prop( { default: true } )
    isActive: boolean;

    @Prop( { type: [String], default: ['user'] } )
    roles: string[];

}


export const UserSchema = SchemaFactory.createForClass( User );

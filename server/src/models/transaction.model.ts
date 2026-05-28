import mongoose from "mongoose";
import { Schema, type Document } from "mongoose";

export enum  RecurringIntervalEnum{
    DAILY = "DAILY",
    MONTHLY = "MONTHLY",
    WEEKLY = "WEEKLY",
    YEARLY = "YEARLY",
}

export enum TransactionStatusEnum{
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FALILED = "FALILED"
}

export enum  TransactionTypeEnum{
    INCOME = "INCOME",
    EXPANSE = "SEPANSE"
}

export enum PaymentMethodEnum{
    CARD = "CARD",
    BANK_TRANSFER = "BANK_TRANSFER",
    MOBILE_PAYMENT = "MOBILE_PAYMENT",
    CASH = "CASH",
    AUTO_DEBIT = "AUTO_DEBIT",
    OTHER = "OTHER",
}

export interface TransactionDocument extends Document{
    userId : mongoose.Types.ObjectId;
    type : keyof typeof TransactionTypeEnum;
    title : string;
    amount : number;
    category : string;
    reciptUrl ?: string
    recurringInterval ?: keyof typeof RecurringIntervalEnum;
    nextRecurringDate ?: Date;
    lastProcessed ?: Date;
    isRecurring :  boolean;
    description ?: string;
    date : Date;
    status : keyof typeof TransactionStatusEnum;
    paymentMethod : keyof typeof PaymentMethodEnum;
    createdAt : Date;
    updatedAt : Date;
}

const transactionSchema = new Schema<TransactionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(TransactionTypeEnum),
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    reciptUrl: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringInterval: {
      type: String,
      enum: Object.values(RecurringIntervalEnum),
      default: null,
    },
    nextRecurringDate: {
      type: Date,
      default: null,
    },
    lastProcessed: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(TransactionStatusEnum),
      default: TransactionStatusEnum.COMPLETED,
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethodEnum),
      default: PaymentMethodEnum.CASH,
    },
  },
  {
    timestamps: true,
    // toJSON: { virtuals: true, getters: true },
    // toObject: { virtuals: true, getters: true },
  }
);

const TransactionModel = mongoose.model<TransactionDocument>(
  "Transaction",
  transactionSchema
);

export default TransactionModel;
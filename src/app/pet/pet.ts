import { Med } from '../med';
export interface Pet {
    name: string;
    imageUrl?: string;
    imgId: string;
    meds: Med[];
}
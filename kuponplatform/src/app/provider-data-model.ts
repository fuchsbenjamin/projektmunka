import { Time } from "@angular/common";

export interface ProviderDataModel {
    name:string;
    email:string;
    location: {
        city:string;
        street:string;
        houseNumber:number
    };
    tags:string[];
    phoneNumber:number;
    openingHours: {
        monday:{from:number, to:number};
        tuesday:{from:number, to:number};
        wednesday:{from:number, to:number};
        thursday:{from:number, to:number};
        friday:{from:number, to:number};
        saturday:{from:number, to:number};
        sunday:{from:number, to:number};
    }
    type:string;
}

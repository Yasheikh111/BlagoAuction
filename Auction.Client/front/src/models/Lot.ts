import LotState from "./LotState";

export interface ILot {
    id: number;
    startDate: Date;
    minBet: string
    description: string
}

export class Lot implements ILot{
    id: number;
    description: string;
    startDate: Date;
    endDate: Date;
    minBet: string;
    isUserRegistered: boolean;
    image: string | undefined;
    userRegistered: number;



    public constructor(id?: number,
                       title?: string,
                       startTime?: Date,
                       endTime?: Date,
                       minBet?: string,
                       isUserRegistered?:boolean,
                       image?: string,
                       userRegistered?: number) {
            this.id = id ?? 0;
            this.description = title ?? "" ;
            this.startDate = startTime ?? new Date();
            this.endDate = endTime ?? new Date();
            this.minBet = minBet ?? "0";
            this.image = image;
            this.isUserRegistered = isUserRegistered ?? false;
            this.userRegistered = userRegistered ?? 0;

    }


    public static getState = (lot:any) => {
        if (lot === undefined)
            return LotState.Scheduled;
        let now = Date.now();
        let start = lot.startDate;
        let end = lot.endDate;
        if (start > now)
            return LotState.Scheduled;
        else if(start < now && now < end)
            return LotState.Started;
        else if(now >= end)
            return LotState.Ended
        return LotState.Ended
    }
}



export default ILot


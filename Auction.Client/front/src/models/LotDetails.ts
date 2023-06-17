import ILot from "./Lot";
import Item from "./Item";
import LotState from "./LotState";

class LotDetails implements ILot{
    public userRegistered: number;

    constructor(item?: Item,
                id?: number,
                minBet?: string,
                startTime?: Date,
                endTime?:Date,
                description?: string,
                delay?: number,
                isReg?: boolean,
                userRegistered?:number) {
        this.item = item ?? new Item("","");
        this.delay = delay ?? 0;
        this.id = id ?? 0;
        this.userRegistered = userRegistered ?? 0;
        this.minBet = minBet ?? "";
        this.startDate = startTime ?? new Date();
        this.endDate = endTime ?? new Date();
        this.description = description ?? "";
        this.canUserBet = isReg ?? false;
    }

    public item : Item;
    public id: number;
    public canUserBet: boolean;
    public minBet: string;
    public startDate: Date;
    public endDate: Date;
    public delay: number
    public description: string;

    getState(): LotState {
        let start = this.startDate.getTime()
        let now = Date.now();
        let end = this.endDate.getTime()
        if (start > now)
            return LotState.Scheduled;
        else if(start < now && now < end)
            return LotState.Started;
        else if(now >= end)
            return LotState.Ended
        return LotState.Ended
    }
}

export default LotDetails
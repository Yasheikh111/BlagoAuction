import React from "react";
import ReactLogo from "../logos/seat-svgrepo-com.svg";
import {Image} from "react-bootstrap";
import {text} from "stream/consumers";

export const UserSeatsComponent: React.FC<{ participants: any[], bets: any[] }> = (props) => {


    return (<div className="border-2 grid grid-cols-10 h-4 w-25">
        {props.participants.map((part: any, index: number) =>
            <div className="w-8" style={

                {transform: "rotateZ(" + (index < (props.participants.length / 2) ? 45 - (index * 45) : 0 - ((((props.participants.length+1) / 2) - (index / 2)) * 45)) + "deg)",
                    marginTop: (index < (props.participants.length / 2) ? (index * 10) : 10 - ((((props.participants.length+1) / 2) - (index / 2)) * 10))
                }}>
                <div>1</div>
            <Image
                className="row p-0 m-0 rounded-2xl w-8 h-auto"
                src={ReactLogo}>
            </Image>
            </div>)
        }
    </div>)
}

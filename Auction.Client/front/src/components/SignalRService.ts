import {HttpTransportType, HubConnection, HubConnectionBuilder, LogLevel} from '@microsoft/signalr';
import {LotBet} from "./LotBetsComponent";
import authUtils from "../services/authUtils";

class SignalRService {
    private connection: HubConnection | null = null;

    constructor() {
        this.connection = new HubConnectionBuilder()
            .configureLogging(LogLevel.Trace)
            .withUrl('http://localhost:8080/betHub/',{
                transport: HttpTransportType.WebSockets,
                skipNegotiation: true,
                accessTokenFactory: () => authUtils.getUser().token,
            })// Specify the URL of your SignalR hub
            .withAutomaticReconnect() // Enable automatic reconnection
            .build();
    }

    startConnection = async () => {
        try {
            await this.connection?.start();
            console.log('SignalR connection started.');
        } catch (error) {
            console.error('Error starting SignalR connection:', error);
        }
    };

    subscribeToNewBetReceived = (callback: (bet: any) => void) => {
        this.connection?.on('newBetNotification', callback);
    };

    subscribeToLotEndReceived = (callback: () => void) => {
        this.connection?.on('lotEndNotification', callback);
    };

    stopConnection = async () => {
        try {
            await this.connection?.stop();
            console.log('SignalR connection stopped.');
        } catch (error) {
            console.error('Error stopping SignalR connection:', error);
        }
    };
}

export default SignalRService;
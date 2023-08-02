export enum Channel {
    Channel1,
    Channel2,
}

export function getChannelText(channel: Channel): string {
    switch (channel) {
        case Channel.Channel1:
            return "Channel 1";
        case Channel.Channel2:
            return "Channel 2";
    }
}

export function getChannelFromURL(channel: string): Channel {
    switch (channel) {
        case "channel2":
            return Channel.Channel2;
        case "channel1":
        default:
            return Channel.Channel1;
    }
}

export function getChannelURL(channel: Channel): string {
    switch (channel) {
        case Channel.Channel1:
            return "channel1";
        case Channel.Channel2:
            return "channel2";
    }
}
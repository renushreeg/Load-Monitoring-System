export enum Type {
    Voltage,
    Current,
    Power,
    Energy,
    Frequency,
    PowerFactor,
}

export function getTypeText(type: Type): string {
    switch (type) {
        case Type.Voltage:
            return "Voltage";
        case Type.Current:
            return "Current";
        case Type.Power:
            return "Power";
        case Type.Energy:
            return "Energy";
        case Type.Frequency:
            return "Frequency";
        case Type.PowerFactor:
            return "Power Factor";
    }
}

export function getTypeFromURL(type: string): Type {
    switch (type) {
        case "current":
            return Type.Current;
        case "power":
            return Type.Power;
        case "energy":
            return Type.Energy;
        case "frequency":
            return Type.Frequency;
        case "powerFactor":
            return Type.PowerFactor;
        case "voltage":
        default:
            return Type.Voltage;
    }
}

export function getTypeURL(type: Type): string {
    switch (type) {
        case Type.Voltage:
            return "voltage";
        case Type.Current:
            return "current";
        case Type.Power:
            return "power";
        case Type.Energy:
            return "energy";
        case Type.Frequency:
            return "frequency";
        case Type.PowerFactor:
            return "powerFactor";
    }
}
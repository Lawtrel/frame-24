export function enableBigIntSerialization() {
    if (BigInt.prototype.toJSON) return;

    BigInt.prototype.toJSON = function() {
        return this.toString();
    };

    console.log("✅ BigInt JSON serialization enabled.");
}
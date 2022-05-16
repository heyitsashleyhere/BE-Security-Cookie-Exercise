import bcrypt from 'bcrypt'

function hash(input) {
    return bcrypt.hash(input, 2)

    // hash(data: string | Buffer, saltOrRounds: string | number): Promise<string>
    // The salt to be used in encryption. If specified as a number then a salt will be generated with the specified number of rounds and used.
    // @return — A promise to be either resolved with the encrypted data hash or rejected with an Error
}

function compareHashes(input, hash) {
    return bcrypt.compare(input, hash)

    // @param data — The data to be encrypted.
    // @param encrypted — The data to be compared against.
    // @return — A promise to be either resolved with the comparison result salt or rejected with an Error
}

export { hash, compareHashes }
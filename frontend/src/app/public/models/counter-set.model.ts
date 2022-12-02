export class CounterSet {
    followingCount: number;
    followerCount: number;
    publications: number;

    constructor(counterSet: Partial<CounterSet>) {
        this.followingCount = counterSet.followingCount ?? 0;
        this.followerCount = counterSet.followerCount ?? 0;
        this.publications = counterSet.publications ?? 0;
    }
}

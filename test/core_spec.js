import { List, Map } from 'immutable';
import { expect } from 'chai';

import { setEntries, next, vote } from '../src/core';

describe('application logic', () => {

    // Set Entries
    describe('set Entries', () => {

        it('adds the entries to the state', () => {
            const state = Map();
            const entries = List.of('Titanic', 'Shutter Island');
            const nextState = setEntries(state, entries);
            expect(nextState).to.equal(Map({
                entries: List.of('Titanic', 'Shutter Island')
            }));
        });

        it('converts to immutable', () => {
            const state = Map();
            const entries = ['Titanic', 'Shutter Island'];
            const nextState = setEntries(state, entries);
            expect(nextState).to.equal(Map({
                entries: List.of('Titanic', 'Shutter Island')
            }));
        });
    });

    // Next
    describe('next', () => {

        it('takes the next two entries under vote', () => {
            const state = Map({
                entries: List.of('Titanic', 'Shutter Island', 'Inception')
            });
            const nextState = next(state);
            expect(nextState).to.equal(Map({
                vote: Map({
                    pair: List.of('Titanic', 'Shutter Island')
                }),
                entries: List.of('Inception')
            }));
        });

        it('puts winner of current vote back to entries', () => {
            const state = Map({
                vote: Map({
                    pair: List.of('Titanic', 'Shutter Island'),
                    tally: Map({
                        'Titanic': 4,
                        'Shutter Island': 2
                    })
                }),
                entries: List.of('Inception', 'The Revenant', 'Django Unchained')
            });
            const nextState = next(state);
            expect(nextState).to.equal(Map({
                vote: Map({
                    pair: List.of('Inception', 'The Revenant'),
                }),
                entries: List.of('Django Unchained', 'Titanic')
            }));
        });

        it('puts both from tied vote back to entries', () => {
            const state = Map({
                vote: Map({
                    pair: List.of('Titanic', 'Shutter Island'),
                    tally: Map({
                        'Titanic': 3,
                        'Shutter Island': 3
                    })
                }),
                entries: List.of('Inception', 'The Revenant', 'Django Unchained')
            });
            const nextState = next(state);
            expect(nextState).to.equal(Map({
                vote: Map({
                    pair: List.of('Inception', 'The Revenant'),
                }),
                entries: List.of('Django Unchained', 'Titanic', 'Shutter Island')
            }));
        });
    });

    // Vote
    describe('vote', () => {

        describe('creates a tally for the voted entry', () => {

            it('creates a tally for the voted entry', () => {
                const state = Map({
                    vote: Map({
                        pair: List.of('Titanic', 'Shutter Island')
                    }),
                    entries: List()
                });
                const nextState = vote(state, 'Titanic');
                expect(nextState).to.equal(Map({
                    vote: Map({
                        pair: List.of('Titanic', 'Shutter Island'),
                        tally: Map({
                            'Titanic': 1
                        })
                    }),
                    entries: List()
                }));
            });

            it('adds to existing tally for the voted entry', () => {
                const state = Map({
                    vote: Map({
                        pair: List.of('Titanic', 'Shutter Island'),
                        tally: Map({
                            'Titanic': 3,
                            'Shutter Island': 2
                        })
                    }),
                    entries: List()
                });
                const nextState = vote(state, 'Titanic');
                expect(nextState).to.equal(Map({
                    vote: Map({
                        pair: List.of('Titanic', 'Shutter Island'),
                        tally: Map({
                            'Titanic': 4,
                            'Shutter Island': 2
                        })
                    }),
                    entries: List()
                }));
            });
        });

    });

});
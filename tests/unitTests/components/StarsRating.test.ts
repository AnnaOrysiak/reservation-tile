import StarsRating from '../../../src/components/starsRating/StarsRating';
import { shallowMount } from '@vue/test-utils';
import { expect } from 'chai';

describe('StarsRating', () => {
    const wrapper = shallowMount(StarsRating, {
        propsData: {
            rating: 5
        }
    });
    const provider = [
        { testId: 0, value: 5, expected: '' },
        { testId: 1, value: 3.2, expected: '' },
        { testId: 2, value: '5', expected: '' },
        { testId: 3, value: null, expected: '' },
    ]

    provider.forEach((testObj) => {
        StarsRating.
        // expect(wrapper.find('.star')).equal(testObj.expected);
    })

});
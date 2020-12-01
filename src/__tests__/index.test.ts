import { compile, MaxProperties, MaxLength, Enum, Required } from '../index';

describe('General', () => {
    test('Should get the valid data', () => {
        enum Gender {
            Male = 0,
            Female = 1,
        }
        /**
         * Decorated class
         */
        @MaxProperties(8)
        class MyData {
            @MaxLength(25)
            public name: string;

            @Enum([0, 1])
            public gender: Gender;

            constructor(
                @Required()
                public id: number,
            ) {
                this.id = id;
            }
        }

        const data = {
            name: 'Amirhossein',
            id: 103423,
            gender: 1,
        };

        const myDataObject = compile(data, MyData);

        expect(myDataObject.validate()).toEqual(true);
        expect(myDataObject.name).toEqual(data.name);
    });
});

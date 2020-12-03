import { compile, MaxProperties, MaxLength, Enum, Required } from 'ajv-class-validator';

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
if (myDataObject.validate()) {
    console.log(myDataObject.name); // output: Amirhossein
} else {
    console.log(myDataObject.errors()); // output errors - if options can passed to AJV `{allErrors: true}` you will have the list of errors
}

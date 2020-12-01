# AJV Class Validator

[![npm](https://img.shields.io/npm/v/ajv-class-validator.svg?style=flat-square)](https://www.npmjs.com/package/ajv-class-validator)
 [![npm](https://img.shields.io/npm/dm/ajv-class-validator.svg?style=flat-square)](https://www.npmjs.com/package/ajv-class-validator)
[![npm](https://img.shields.io/npm/l/ajv-class-validator.svg?style=flat-square)](https://www.npmjs.com/package/ajv-class-validator)

Lightweight class validator for [AJV](https://github.com/ajv-validator/ajv) the fastest JSON Schema validator.


## Install

To install packages:

```
npm i ajv reflect-metadata ajv-class-validator
```

## Usage

Adding decorator to the class and validate the data

```typescript
import { 
    compile, 
    MaxProperties, 
    MaxLength,
    Enum,
    Required
    } from 'ajv-class-validator';

/**
 * Decorated class
 */
@MaxProperties(8)
class MyData {

    @MaxLength(25) 
    public name: string

    @Enum([0,1]) 
    public gender: Gender

    constructor(
    @Required()
    public id: number
    ) {
        this.id = id
    }
}

const data = {
    name: 'Amirhossein',
    id: 103423,
    gender: 1
}

const myDataObject =  compile(data, MyData)

if(myDataObject.validate()) {
    console.log(myDataObject.name) // output: Amirhossein
} else {
    console.log(myDataObject.errors()) // output errors - if options can passed to AJV `{allErrors: true}` you will have the list of errors
}

```
Passing [AJV options](https://github.com/ajv-validator/ajv/blob/master/docs/api.md#options) and using [ajv-formats](https://github.com/ajv-validator/ajv-formats)

```typescript
import { 
    compile, 
    addAJVInitializer, // <--- Add AJV initializer
    MaxProperties, 
    MaxLength,
    Enum,
    Required
    } from 'ajv-class-validator';
import Ajv from "ajv"
import addFormats from "ajv-formats"

// Add custom AJV initializer
const ajv = new Ajv()
addAJVInitializer(() => {
    const ajv = new Ajv({allErrors: true})
    addFormats(ajv, ["uri"])
    return ajv
})

/**
 * Decorated class
 */
@MaxProperties(8)
class MyData {

    @MaxLength(25) 
    public name: string

    @Format('uri') 
    public web: string

    @Enum([0,1]) 
    public gender: Gender

    constructor(
    @Required()
    public id: number
    ) {
        this.id = id
    }
}

const data = {
    name: 'Amirhossein',
    id: 103423,
    gender: 1,
    web: 'https://telar.dev'
}

const myDataObject =  compile(data, MyData)

if(myDataObject.validate()) {
    console.log(myDataObject.web) // output: https://telar.dev
} else {
    console.log(myDataObject.errors()) // output errors - if options can passed to AJV `{allErrors: true}` you will have the list of errors
}
```

### Nested class objects
The validation will be applied on nested class object if the nested class decorated with `@Model()` decorator.

```typescript
import { 
    compile, 
    MaxProperties, 
    MaxLength,
    Enum,
    Required
    } from 'ajv-class-validator';



@Model() // <- Most decorate with `@Model` decorator if we want to use as a nested object
class MyNestedData {

    @MaxLength(100) 
    public address: string
}

@MaxProperties(8)
class MyData {

    @MaxLength(25) 
    public name: string

    @Enum([0,1]) 
    public gender: Gender

    @Allow() // <- if there is no validation decorator we should add `@Allow()` decorator, if not compiler igonr the field
    public nestedObject: MyNestedData

    constructor(
    @Required()
    public id: number
    ) {
        this.id = id
    }
}

```
### Customize complied map

There are some packages for AJV like [ajv-errors](https://github.com/ajv-validator/ajv-errors) which is not supported as a decorator, in this case you can use `@Model(schemaCallback)` decorator to edit the compiled schema.

> (Note: You should know what you are doing with customization if not it will break the schema)

```typescript
@MaxProperties(8)
@Model((schema) => {
    schema = {
    ...schema, 
    errorMessage: "should be an object with an integer property foo only",
 }
    return schema
})
class MyData {

    @MaxLength(25) 
    public name: string

    @Enum([0,1]) 
    public gender: Gender

    @Allow() // <- if there is no validation decorator we should add `@Allow()` decorator, if not compiler igonr the field
    public nestedObject: MyNestedData

    constructor(
    @Required()
    public id: number
    ) {
        this.id = id
    }
}
```

## Decorators
To get more details about functionallity of each decorator please check [AJV json-schema doc](https://github.com/ajv-validator/ajv/blob/master/docs/json-schema.md). 

| Decorator                                       | Description                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Common decorators**                |
| `@Allow()`                        | Include the field with no validation decorator in comiled obect.                              |
| `@Model(schemaCallback?: SchemaObject)`          | Required for the object that used a the class as a nested object. We also can pass the customize schema callback function to modify schema at compile time.      |   |
| **Types validation decorators**                  |
| `@Enum(enum: any[])`                                  | The value of the decorator should be an array of unique items of any types. The data is valid if it is deeply equal to one of items in the array.              |
| `@Const(constType: any)`                                     | The value of this decorator can be anything. The data is valid if it is deeply equal to the value of the decorator.                                             |   |
| **Numbers validation decorators**                |
| `@Max(maximum: number)`                   | The value of decorator `maximum` should be a number. This value is the `maximum` allowed value for the data to be valid.                                                                                                                                                                                                                                                                                                                                                         |
| `@Min(minimum: number)`                                 | The value of keyword `minimum` should be a number. This value is the `minimum` allowed value for the data to be valid.                                                                                                                                                                                                                                                                                                                                                          |
| `@MultipleOf(multipleOf: number)`                                 | The value of the keyword should be a number. The data to be valid should be a multiple of the keyword value (i.e. the result of division of the data on the value should be integer).                                                                                                                                                                                                                                                                                                                                                        |
| `ExclusiveMaximum(exclusiveMaximum: number)`                             | The value of keyword exclusiveMaximum should be a number. This value is the exclusive maximum allowed value for the data to be valid (the data equal to this keyword value is invalid).                                                                                                                                                                                                                                                                                                                                                 |
| `@ExclusiveMinimum(exclusiveMinimum: number)`                             | The value of keyword exclusiveMinimum should be a number. This value is the exclusive minimum allowed value for the data to be valid (the data equal to this keyword value is invalid).                                                                                                                                                                                                                                                                                                                                                   |
| **Strings validation decorators**                  |
| `@Format(format: string)`                          | The value of the keyword should be a string. The data to be valid should match the format with this name.                                                                                                                                                                                                                                                                                                                                                       |
| `@MaxLength(maxLength: number)`                          | The value of the keywords should be a number. The data to be valid should have length satisfying this rule. Unicode pairs are counted as a single character.                                                                                                                                                                                                                                                                                                                                                      |
| `@Pattern(pattern: string)`                          | The value of the keyword should be a string. The data to be valid should match the regular expression defined by the keyword value. Ajv uses new RegExp(value, "u") to create the regular expression that will be used to test data.                                                                                                                                                                                                                                                                                                                                                      |
| **Array validation decorators**                |
| `@AdditionalItems(additionalItems: boolean)`| The value of the keyword should be a boolean or an object.|
| `@Contains(contains: Record<string, any>)` | The value of the keyword is a JSON Schema. The array is valid if it contains at least one item that is valid according to this schema. |
| `@Items(items: Record<string, string>[])`|The value of the keyword should be an object or an array of objects. |
| `@MaxContains(maxContains: number)`                             | The value of these keywords should be an integer.The array is valid if it contains at least `minContains` items and no more than `maxContains` items that are valid against the schema in `contains` keyword.                                                                                                                                                                                                                                                                                                                                                          |
| `@MaxItems(maxItems: number)`        | The value of the keywords should be a number. The data array to be valid should not have more items than the keyword value. |
| `@MinContains(minContains: number)`                                    | The value of these keywords should be an integer. The array is valid if it contains at least `minContains` items and no more than `maxContains` items that are valid against the schema in `contains` keyword.|
| `@MinItems(minItems: number)`                                   | The value of the keywords should be a number. The data array to be valid should not have less items than the keyword value.                                                                                                                                                                                                                                                                                                                                                                               |
| <code>@UnevaluatedItems(unevaluatedItems: boolean &#124; SchemaObject &#124; JSONSchemaType<unknown, false>)</code>                                   | This schema will be applied to all array items that were not evaluated by other keywords for items (`items`, `additionalItems` and `contains`) in the current schema and all sub-schemas that were valid for this data instance.                                                                                                                                                                                                                                                                                                                                                                               |
| `@UniqueItems(uniqueItems: boolean)` | The value of the keyword should be a boolean. If the keyword value is true, the data array to be valid should have unique items.  |
| **Objects validation decorators**                 |
| <code>@AdditionalProperties(additionalProperties: boolean &#124; SchemaObject &#124; JSONSchemaType<unknown, false>)</code>                 | The value of the keyword should be either a boolean or a JSON Schema.If the value is `true` the keyword is ignored.If the value is `false` the data object to be valid should not have "additional properties" (i.e. properties other than those used in "properties" keyword and those that match patterns in "patternProperties" keyword).If the value is a schema for the data object to be valid the values in all "additional properties" should be valid according to this schema.                                                                                                                                                                                                                                                     |
| `DependentRequired(dependentRequired: any)`              | The value of this keyword should be a map with keys equal to data object properties. Each value in the map should be an array of unique property names.If the data object contains a property that is a key in the keyword value, then to be valid the data object should also contain all properties from the corresponding array of properties in this keyword.                                                                                                                                                                                                                                                                                                                                                          |
| `@DependentSchemas(dependentSchemas: any)`                              | The value of the keyword should be a map with keys equal to data object properties. Each value in the map should be a JSON Schema.If the data object contains a property that is a key in the keyword value, then to be valid the data object itself (NOT the property value) should be valid according to the corresponding schema in this keyword.                                                                                                                                                                                                                                                                                                                                                                                 |
| `@MaxProperties(maxProperties: number)`                    | The value of the keywords should be a number. The data object to be valid should have not more properties than the keyword value.                                                                                                                                                                                                                                                                                                                                                                 |
| `@MinProperties(minProperties: number)`                    | The value of the keywords should be a number. The data object to be valid should have not less properties than the keyword value.                                                                                                                                                                                                                                                                                                                                                                |
| `@PatternProperties(patternProperties: any)`                                | The value of this keyword should be a map where keys should be regular expressions and the values should be JSON Schemas. For data object to be valid the values in data object properties that match regular expression(s) should be valid according to the corresponding schema(s).When the value in data object property matches multiple regular expressions it should be valid according to all the schemas for all matched regular expressions.                                                                                                                                                                                                                                                                                                                                 |
| `@Properties(properties: any)`                       | The value of the keyword should be a map with keys equal to data object properties. Each value in the map should be a JSON Schema. For data object to be valid the corresponding values in data object properties should be valid according to these schemas. |
| `@PropertyNames(propertyNames: any)`                       | The value of this keyword is a JSON Schema. For data object to be valid each property name in this object should be valid according to this schema. |
| `@Required()`                       | The value of the keyword should be an array of unique strings. The data object to be valid should contain all properties with names equal to the elements in the keyword value. |
| <code>@UnevaluatedProperties(unevaluatedProperties: boolean &#124; SchemaObject &#124; JSONSchemaType<unknown, false>)</code>                       | The value of this keyword is a JSON Schema (can be a boolean).This schema will be applied to all properties that were not evaluated by other keywords for properties (`properties`, `patternProperties` and `additionalProperties`) in the current schema and all sub-schemas that were valid for this data instance. |
| **Compound validation decorators**                |
| `@AllOf(allOf: any)`                       | The value of the keyword should be an array of JSON Schemas. The data is valid if it is valid according to all JSON Schemas in this array. |
| `@AnyOf(anyOf: any)`                       | The value of the keyword should be an array of JSON Schemas. The data is valid if it is valid according to one or more JSON Schemas in this array. Validators only need to validate data against schemas in order until the first schema matches (or until all schemas have been tried). For this reason validating against this keyword is faster than against "oneOf" keyword in most cases. |
| `@OneOf(oneOf: any)`                       | The value of the keyword should be an array of JSON Schemas. The data is valid if it matches exactly one JSON Schema from this array. Validators have to validate data against all schemas to establish validity according to this keyword. |
| `@If(ifOperation: any)`                       | These keywords allow to implement conditional validation. Their values should be valid JSON Schemas (object or boolean).If `if` keyword is absent, the validation succeeds.If the data is valid against the sub-schema in `if` keyword, then the validation result is equal to the result of data validation against the sub-schema in `then` keyword (if `then` is absent, the validation succeeds).If the data is invalid against the sub-schema in `if` keyword, then the validation result is equal to the result of data validation against the sub-schema in `else` keyword (if `else` is absent, the validation succeeds). |
| `@Else(elseOperation: any)`                       | These keywords allow to implement conditional validation. Their values should be valid JSON Schemas (object or boolean).If `if` keyword is absent, the validation succeeds.If the data is valid against the sub-schema in `if` keyword, then the validation result is equal to the result of data validation against the sub-schema in `then` keyword (if `then` is absent, the validation succeeds).If the data is invalid against the sub-schema in `if` keyword, then the validation result is equal to the result of data validation against the sub-schema in `else` keyword (if `else` is absent, the validation succeeds). |
| `Then(thenOperation: any)`                       | These keywords allow to implement conditional validation. Their values should be valid JSON Schemas (object or boolean).If `if` keyword is absent, the validation succeeds.If the data is valid against the sub-schema in `if` keyword, then the validation result is equal to the result of data validation against the sub-schema in `then` keyword (if `then` is absent, the validation succeeds).If the data is invalid against the sub-schema in `if` keyword, then the validation result is equal to the result of data validation against the sub-schema in `else` keyword (if `else` is absent, the validation succeeds). |
| `@Not(not: any)`                       | The value of the keyword should be a JSON Schema. The data is valid if it is invalid according to this schema. |

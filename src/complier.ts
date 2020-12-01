// Copyright (c) 2020 Amirhossein Movahedi (@qolzam)
//
// This file adapted for deserializing functionallity from https://github.com/GillianPerard/typescript-json-serializer/blob/master/src/index.ts -
// By [@GillianPerard](https://github.com/GillianPerard) Under [MIT License](https://github.com/GillianPerard/typescript-json-serializer/blob/master/LICENSE)
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import 'reflect-metadata';
import Ajv, { ErrorObject } from 'ajv';

const apiMap = 'telar:map:';
const apiValidator = `${apiMap}validaitor`;
const apiMapClass = `${apiMap}class`;
const designType = 'design:type';
const designParamTypes = 'design:paramtypes';

// Enums
enum Type {
    Array = 'array',
    Boolean = 'boolean',
    Date = 'date',
    Number = 'number',
    Object = 'object',
    String = 'string',
}

type Metadata =
    | {
          name: string;
          type: Function;
      }
    | {
          names: Array<string>;
          type: Function;
      };

type Compile<T> = T & { validate: () => boolean | PromiseLike<any>; errors: () => ErrorObject[] };

let ajvInit = () => {
    return new Ajv();
};
/**
 * Add AJV initializer callback
 * @param callback AJV intia
 */
export const addAJVInitializer = (callback: () => Ajv) => {
    ajvInit = callback;
};

/**
 * Function to get all base class names recursively
 *
 * @param {Object} target The target class from which the parent classes are extracted
 * @returns {Array<string>} All the base class names
 */
function getBaseClassNames(target: Object): Array<string> {
    const names: Array<string> = [];
    const baseClass = Reflect.getPrototypeOf(target);

    if (!baseClass || !baseClass['name']) {
        return names;
    }

    names.push(baseClass['name']);
    return [...names, ...getBaseClassNames(baseClass)];
}

/**
 * Function to find the name of function properties
 *
 * @param {object} ctor The constructor from which the properties are extracted
 * @returns {Array<string>} All the property names
 */
function getPropertyNames(ctor: object): Map<number, string> {
    // Remove all kind of comments
    const ctorWithoutComments = ctor.toString().replace(/(\/\*[\s\S]*?\*\/|\/\/.*$)/gm, '');
    const ctorOnSingleLine = ctorWithoutComments.replace(/[\r\t\n\v\f]/g, '');
    const ctorWithoutSuccessiveWhiteSpaces = ctorOnSingleLine.replace(/( +)/g, ' ');

    // Parse function body
    const constructorParamPattern = /(?:.*(?:constructor|function).*?(?=\())(?:\()(.+?(?=\)))/m;
    const propertyPattern = /(?:this\.)([^\n\r\t\f\v;]+)([\s;])/gm;
    const propertyNames = new Map<number, string>();
    const paramsExecArray = constructorParamPattern.exec(ctorWithoutSuccessiveWhiteSpaces);

    if (!paramsExecArray || !paramsExecArray.length) {
        return propertyNames;
    }

    const params = paramsExecArray[1].replace(/ /g, '').split(',');
    let match: RegExpExecArray;

    // Get params
    while ((match = propertyPattern.exec(ctorWithoutSuccessiveWhiteSpaces))) {
        const matchResult = match[1].replace(/ /g, '').split('=');
        const index = params.findIndex((param) => param === matchResult[1]);

        if (index > -1) {
            propertyNames.set(index, matchResult[0]);
        }
    }

    return propertyNames;
}

export function mapProperty(target: Object | Function, key: string) {
    let map: { [id: string]: Metadata } = {};
    // Object class name which the property belongs to
    const targetName = target.constructor.name;

    // Create metadata key to store property metadata on object
    const apiMapTargetName = `${apiMap}${targetName}`;
    if (Reflect.hasMetadata(apiMapTargetName, target)) {
        map = Reflect.getMetadata(apiMapTargetName, target);
    }

    map[key] = getJsonPropertyValue(key);
    Reflect.defineMetadata(apiMapTargetName, map, target);
}

/**
 * Map properties to validation schema
 * @param target
 * @param key
 * @param type
 * @param mapper
 */
export function mapValidation(target: Object | Function, key: string, type: Function, mapper: Function) {
    let map: { type: string; properties: { [id: string]: any } } = {
        type: 'object',
        properties: { [key]: { type: type.name.toLocaleLowerCase() } },
    };
    // Object class name which the property belongs to
    const targetName = target.constructor.name;

    // Create metadata key to store property metadata on object
    const apiMapValidatorName = `${apiValidator}${targetName}`;

    if (Reflect.hasMetadata(apiMapValidatorName, target)) {
        map = Reflect.getMetadata(apiMapValidatorName, target);

        map.properties[key] = map.properties[key]
            ? { ...map.properties[key] }
            : { type: type.name.toLocaleLowerCase() };
    }

    map = mapper(map, key);

    Reflect.defineMetadata(apiMapValidatorName, map, target);
}

/**
 * Property validator
 */
export function propertyValidator(mapper: Function): Function {
    return (target: Object | Function, key: string, index: number): void => {
        let type: Function = null;
        /**
         * Whether propert has the validation decorator
         */
        if (key === undefined && target['prototype']) {
            // Property type
            type = Reflect.getMetadata(designParamTypes, target)[index];

            // Get all object properties name
            const keys = getPropertyNames(target['prototype'].constructor);
            // Get current property name
            key = keys.get(index);
            // Target prototype
            target = target['prototype'];
            // Store type of the property in metadata
            Reflect.defineMetadata(designType, type, target, key);
        } else {
            type = Reflect.getMetadata('design:type', target, key);
        }

        mapValidation(target, key, type, mapper);
        mapProperty(target, key);
    };
}

/**
 * Class validator
 */
export function validateClass(mapper: Function): Function {
    return (target: Object) => {
        let map: { type: string; properties: { [id: string]: any } } = { type: 'object', properties: {} };

        if (Reflect.hasMetadata(apiMapClass, target)) {
            map = Reflect.getMetadata(apiMapClass, target).map;
        }

        map = mapper(map);

        const baseClassNames = getBaseClassNames(target);
        Reflect.defineMetadata(apiMapClass, { map, baseClassNames }, target);
    };
}

/**
 * Function to retrieve and merge all base class properties
 *
 * @param baseClassNames The base classe names of the instance provided
 * @param {any} instance The instance target from which the parents metadata are extracted
 * @returns {{ [id: string]: Metadata }} All base class metadata properties
 */
function getBaseClassMaps(baseClassNames: Array<string>, instance: any): { [id: string]: Metadata } {
    let baseClassMaps: { [id: string]: Metadata } = {};

    baseClassNames.forEach((baseClassName) => {
        baseClassMaps = {
            ...baseClassMaps,
            ...Reflect.getMetadata(`${apiMap}${baseClassName}`, instance),
        };
    });

    return baseClassMaps;
}

/**
 * Compile data object
 *
 * @param {object} data The data to compile
 * @param {new (...params: Array<any>) => T} type The class in which we want to deserialize
 * @param options AJV intitialization options
 * @returns {T} The instance of the specified type containing all deserialized properties
 */
export function compile<T>(data: object, type: new (...params: Array<any>) => T): Compile<T> {
    const result = compileWithValidation(data, type);

    // Inject AJV validation
    if (!ajvInit) {
        throw new Error('AJV initializer can not be null!');
    }
    const ajv = ajvInit();
    if (!ajv) {
        throw new Error('AJV initializer returend null!');
    }
    result.instance.constructor.prototype.__ajv = ajv;
    result.instance.constructor.prototype.__validate = ajv.compile(result.validationMap);
    result.instance.constructor.prototype.validate = function () {
        const __isValid = this.constructor.prototype.__validate(this);

        if (!__isValid) {
            this.constructor.prototype.__errors = this.constructor.prototype.__validate.errors;
        } else {
            this.constructor.prototype.__errors = [];
        }

        return __isValid;
    };
    result.instance.constructor.prototype.errors = function () {
        return this.constructor.prototype.__errors;
    };

    return result.instance as Compile<T>;
}

/**
 * Compile data object with validation map
 *
 * @param {object} data The data to compile
 * @param {new (...params: Array<any>) => T} type The class in which we want to deserialize
 * @returns {T} The instance of the specified type containing all deserialized properties with validation map
 */
export function compileWithValidation<T>(
    json: object,
    type: new (...params: Array<any>) => T,
): { instance: T; validationMap: any } {
    if ([null, undefined].includes(json)) {
        return json as never;
    }

    if (type === undefined) {
        return castSimpleData(typeof json, json);
    }

    const instance: any = new type();

    const instanceName = instance.constructor.name;

    // Class metadata map
    const { baseClassNames, map } = Reflect.getMetadata(apiMapClass, type) ?? { map: {} };

    // Property data mapping
    const apiMapTargetName = `${apiMap}${instanceName}`;
    const hasMap = Reflect.hasMetadata(apiMapTargetName, instance);

    if (!hasMap && (!baseClassNames || !baseClassNames.length)) {
        return instance;
    }

    let instanceMap: { [id: string]: Metadata } = {};
    instanceMap = Reflect.getMetadata(apiMapTargetName, instance);

    // Propery validation mapping
    const apiMapInstanceName = `${apiValidator}${instanceName}`;
    const validationPropsMap = Reflect.getMetadata(apiMapInstanceName, instance);
    const validationMap = { ...map, ...validationPropsMap };

    if (baseClassNames && baseClassNames.length) {
        instanceMap = { ...instanceMap, ...getBaseClassMaps(baseClassNames, instance) };
    }

    Object.keys(instanceMap).forEach((key) => {
        const property = convertDataToProperty(instance, key, instanceMap[key], json, validationMap);

        if (property !== undefined) {
            instance[key] = property;
        }
    });

    return { instance, validationMap };
}

/**
 * Function to convert json data to the class property
 * @param {Function} instance The instance containing the property to convert
 * @param {string} key The name of the property to convert
 * @param {Metadata} metadata The metadata of the property to convert
 * @param {any} json Json containing the values
 */
function convertDataToProperty(instance: Function, key: string, metadata: Metadata, json: any, validationMap: any) {
    let data: any;

    if ([null, undefined].includes(json)) {
        return json;
    }

    if ('names' in metadata) {
        const object = {};
        metadata.names.forEach((name: string) => (object[name] = json[name]));
        data = object;
    } else {
        data = json[metadata.name];
    }

    if ([null, undefined].includes(data)) {
        return data;
    }

    const type: any = Reflect.getMetadata(designType, instance, key);
    const isArray = type.name ? type.name.toLowerCase() === Type.Array : false;
    const propertyType: any = metadata['type'] || type;
    const isModelProperty = isModel(propertyType);

    let result: any;

    if (!isModelProperty) {
        result = castSimpleData(propertyType.name, data);
    } else if (isArray) {
        const array = [];

        if (!Array.isArray(data)) {
            // eslint-disable-next-line no-console
            console.error(`${data} is not an array.`);
            result = undefined;
        } else {
            data.forEach((d: any) => {
                array.push(compile(d, propertyType));
            });
            result = array;
        }
    } else {
        const deserializedResult = compileWithValidation(data, propertyType);
        result = deserializedResult.instance;

        validationMap.properties[key] = deserializedResult.validationMap;
    }

    return result;
}

/**
 * Check if a class is serializable
 *
 * @param {any} type The type to check
 * @returns {boolean} If the type is a model or not
 */
function isModel(type: any): boolean {
    return Reflect.hasOwnMetadata(apiMapClass, type);
}

/**
 * Function to transform the JsonProperty value into Metadata
 *
 * @param {string} key The property name
 * @param {Args} args Arguments to describe the property
 * @returns {Metadata} The metadata object
 */
function getJsonPropertyValue(key: string): Metadata {
    return {
        name: key.toString(),
        type: undefined,
    };
}

/**
 * Function to cast simple type data into the real class property type
 *
 * @param {string} type The type to cast data into
 * @param {any} data The data to cast
 * @returns {any} The casted data
 */
function castSimpleData(type: string, data: any): any {
    if (type === undefined || type === null) {
        return data;
    }

    type = type.toLowerCase();

    if ((typeof data).toLowerCase() === type) {
        return data;
    }

    switch (type) {
        case Type.String:
            return data ? data.toString() : data;
        case Type.Number:
            const number: number = +data;
            if (isNaN(number)) {
                // eslint-disable-next-line no-console
                console.error(`${data}: Type ${typeof data} is not assignable to type ${type}.`);
                return undefined;
            }
            return number;
        case Type.Boolean:
            // eslint-disable-next-line no-console
            console.error(`${data}: Type ${typeof data} is not assignable to type ${type}.`);
            return undefined;
        case Type.Date:
            if (isNaN(Date.parse(data))) {
                // eslint-disable-next-line no-console
                console.error(`${data}: Type ${typeof data} is not assignable to type ${type}.`);
                return undefined;
            }
            return new Date(data);
        default:
            return data;
    }
}

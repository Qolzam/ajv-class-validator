import { propertyValidator } from '../../complier';

/**
 * The value of the keywords should be a number. The data object to be valid should have not more properties than the keyword value.
 *
 * [AJV Doc](https://github.com/ajv-validator/ajv/blob/master/docs/json-schema.md#const)
 */
export function Const(constType: any): Function {
    const mapper = (map: Record<string, unknown>, key: string) => {
        const parsed = { ...map.properties[key], const: constType };
        delete parsed.type;
        map.properties[key] = parsed;
        return map;
    };
    return propertyValidator(mapper);
}

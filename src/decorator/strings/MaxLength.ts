import { propertyValidator } from '../../complier';

/**
 * The value of the keywords should be a number. The data to be valid should have length satisfying this rule. Unicode pairs are counted as a single character.
 *
 * [AJV Doc](https://github.com/ajv-validator/ajv/blob/master/docs/json-schema.md#maxlength--minlength)
 */
export function MaxLength(maxLength: number): Function {
    const mapper = (map: Record<string, unknown>, key: string) => {
        map.properties[key] = { ...map.properties[key], maxLength: maxLength };
        return map;
    };
    return propertyValidator(mapper);
}

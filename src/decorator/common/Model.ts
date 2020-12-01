import { JSONSchemaType, SchemaObject } from 'ajv';
import { validateClass } from '../../complier';

/**
 * Enable class as part of nested object validation
 * @param schema The schema will be merged with the compiled schema
 *
 */
export function Model(
    schemaCallback?: (
        map: SchemaObject | JSONSchemaType<unknown, false>,
    ) => SchemaObject | JSONSchemaType<unknown, false>,
): Function {
    const mapper = (map: SchemaObject | JSONSchemaType<unknown, false>) => {
        if (schemaCallback) {
            map = schemaCallback(map);
        }
        return map;
    };
    return validateClass(mapper);
}

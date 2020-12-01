import { propertyValidator } from '../../complier';

/**
 * The property is allowed in validation.
 */
export function Allow(): Function {
    const mapper = (map: Record<string, unknown>) => {
        return map;
    };
    return propertyValidator(mapper);
}

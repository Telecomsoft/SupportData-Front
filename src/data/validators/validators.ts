// Define types for validation patterns
interface RegexValidator {
    regex: RegExp
    message: string
    massageInput?: string
}

// Define types for individual validators
interface PatternValidator {
    pattern: {
        value: RegExp
        message: string
    }
}

interface MinLengthValidator {
    minLength: {
        value: number
        message: string
    }
}

interface Validator extends PatternValidator, Partial<MinLengthValidator> {}

// Regular expressions and messages
const REQUIRED_REGEX = /[^\s-]/
const PHONE_REGEX = /(^([\u06F0]|[0])([\u06F9]|[9])(([\u06F0-\u06F9]|[0-9]){2})(([\u06F0-\u06F9]|[0-9]){3})(([\u06F0-\u06F9]|[0-9]){4})$)/
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
export const EMAIL_OR_PHONE =
    /(^([\u06F0]|[0])([\u06F9]|[9])(([\u06F0-\u06F9]|[0-9]){2})(([\u06F0-\u06F9]|[0-9]){3})(([\u06F0-\u06F9]|[0-9]){4})$)|(^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$)+$/i
const PASSWORD = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9*-_!'()~/@#$%^&+=]*$/
const THREE_DIGIT_NUMBER_REGEX = /^[0-9]{3}$/
const TWO_DIGIT_NUMBER_REGEX = /^[0-9]{2}$/
const DIGIT_NUMBER_REGEX = /^-?\d+\.?\d*$/
const GREATER_THAN_ZERO = /^(0*[1-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*)$/
const GREATER_THAN_ZERO_HOURS_MINUTES = /^(?!00:00$)([01]\d|2[0-3]):[0-5]\d$/
export const MIN_LENGTH_6_MESSAGE = 'رمز عبور باید حداقل 6 کاراکتر داشته باشد.'
export const IS_NOT_EQUAL_PASSWORD = 'رمز عبور و تکرارش برابر نیست'
export const NATIONAL_ID_MUST_BE_TEN_DIGITS = 'کدملی باید ده رقمی باشد'
const VERSION_REGEX = /^[0-9]+\.[0-9]+\.[0-9]+$/
const POSITIVE_FLOAT_REGEX = /^\d*\.?\d+$/

// Match regex patterns with messages
export const MATCHES_REGEX: Record<string, RegexValidator> = {
    REQUIRED: { regex: REQUIRED_REGEX, message: 'فیلد نباید خالی باشد.', massageInput: 'Invalid Input (Empty space at the beginning)' },
    THREE_DIGIT_NUMBER: { regex: THREE_DIGIT_NUMBER_REGEX, message: '3 Digit Number' },
    TWO_DIGIT_NUMBER: { regex: TWO_DIGIT_NUMBER_REGEX, message: '2 Digit Number' },
    GREATER_THAN_ZERO: { regex: GREATER_THAN_ZERO, message: 'Must be Greater than 0' },
    GREATER_THAN_ZERO_HOURS_MINUTES: { regex: GREATER_THAN_ZERO_HOURS_MINUTES, message: 'Must be Greater than 00:00' },
    DIGIT_NUMBER_REGEX: { regex: DIGIT_NUMBER_REGEX, message: 'Invalid Digit Number' },
    EMAIL: { regex: EMAIL_REGEX, message: 'ایمیل باید به درستی وارد شود.' },
    PHONE: { regex: PHONE_REGEX, message: 'موبایل باید به درستی وارد شود.' },
    EMAIL_OR_PHONE: {
        regex: EMAIL_OR_PHONE,
        message: 'ایمیل یا شماره موبایل باید به درستی وارد شود.',
    },
    PASSWORD: {
        regex: PASSWORD,
        message: 'همزمان از حروف انگلیسی و عدد در آن استفاده شود.',
    },
    POSITIVE_FLOAT: { regex: POSITIVE_FLOAT_REGEX, message: 'Must be a positive float number' },
}

// Validators
export const PHONE_VALIDATOR: PatternValidator = {
    pattern: {
        value: MATCHES_REGEX.PHONE.regex,
        message: MATCHES_REGEX.PHONE.message,
    },
}

export const REQUIRED_VALIDATOR = {
    required: MATCHES_REGEX.REQUIRED.message,
}

export const REQUIRED_VALIDATOR_TEXT = {
    pattern: {
        value: MATCHES_REGEX.REQUIRED.regex,
        message: MATCHES_REGEX.REQUIRED.massageInput
    },
}


export const THREE_DIGIT_NUMBER_VALIDATOR: PatternValidator = {
    pattern: {
        value: MATCHES_REGEX.THREE_DIGIT_NUMBER.regex,
        message: MATCHES_REGEX.THREE_DIGIT_NUMBER.message,
    },
}

export const DIGIT_NUMBER_REGEX_VALIDATOR: PatternValidator = {
    pattern: {
        value: MATCHES_REGEX.DIGIT_NUMBER_REGEX.regex,
        message: MATCHES_REGEX.DIGIT_NUMBER_REGEX.message,
    },
}

export const TWO_DIGIT_NUMBER_VALIDATOR: PatternValidator = {
    pattern: {
        value: MATCHES_REGEX.TWO_DIGIT_NUMBER.regex,
        message: MATCHES_REGEX.TWO_DIGIT_NUMBER.message,
    },
}

export const GREATER_THAN_ZERO_VALIDATOR: PatternValidator = {
    pattern: {
        value: MATCHES_REGEX.GREATER_THAN_ZERO.regex,
        message: MATCHES_REGEX.GREATER_THAN_ZERO.message,
    },
}

export const GREATER_THAN_ZERO_HOURS_MINUTES_VALIDATOR: PatternValidator = {
    pattern: {
        value: MATCHES_REGEX.GREATER_THAN_ZERO_HOURS_MINUTES.regex,
        message: MATCHES_REGEX.GREATER_THAN_ZERO_HOURS_MINUTES.message,
    },
}

export const EMAIL_VALIDATOR: PatternValidator = {
    pattern: {
        value: MATCHES_REGEX.EMAIL.regex,
        message: MATCHES_REGEX.EMAIL.message,
    },
}

export const EMAIL_OR_PHONE_VALIDATOR: PatternValidator = {
    pattern: {
        value: MATCHES_REGEX.EMAIL_OR_PHONE.regex,
        message: MATCHES_REGEX.EMAIL_OR_PHONE.message,
    },
}

export const PASSWORD_VALIDATOR: Validator = {
    minLength: {
        value: 6,
        message: MIN_LENGTH_6_MESSAGE,
    },
    pattern: {
        value: MATCHES_REGEX.PASSWORD.regex,
        message: MATCHES_REGEX.PASSWORD.message,
    },
}

export const VERSION_VALIDATOR: PatternValidator = {
    pattern: {
        value: VERSION_REGEX,
        message: 'Invalid version format. Must be in the format X.Y.Z',
    },
}

export const POSITIVE_FLOAT_VALIDATOR: PatternValidator = {
    pattern: {
        value: MATCHES_REGEX.POSITIVE_FLOAT.regex,
        message: MATCHES_REGEX.POSITIVE_FLOAT.message,
    },
}

export const IP_ADDRESS_VALIDATOR: PatternValidator = {
    pattern: {
        value: /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])$/,
        message: 'حداکثر 3 رقم',
    },
}

export const PORT_VALIDATOR = {
    pattern: {
        value: /^[1-9]\d{2}$/, // Ensures the port is a 3-digit number between 100-999
        message: 'پورت طولانی میباشد',
    },
}

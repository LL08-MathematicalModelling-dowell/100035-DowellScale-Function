import * as Yup from 'yup';

const REQUIRED_TXT = 'This field is required';

const numberValidation = Yup.number()
    .typeError('Please enter a valid number')
    .min(0, 'Number must be greater than or equal 0')
    .max(9, 'Number must be less than 9')
    .required(REQUIRED_TXT)



export const rankingScalesSchema = Yup.object({
    // user: Yup.boolean().required(REQUIRED_TXT),
    // username: Yup.string(),
    scalename: Yup.string().required(REQUIRED_TXT),
    num_of_stages: numberValidation,
    stages: Yup.string().required(REQUIRED_TXT),
    num_of_substages: numberValidation,
    item_count:numberValidation,
    item_list:Yup.string().required(REQUIRED_TXT),
    stages_arrangement: Yup.string().required(REQUIRED_TXT),
    scalecolor: Yup.string().required(REQUIRED_TXT),
    fontcolor: Yup.string().required(REQUIRED_TXT),
    fontstyle: Yup.string().required(REQUIRED_TXT),
    orientation: Yup.string().required(REQUIRED_TXT),
    ranking_method_stages: Yup.string().required(REQUIRED_TXT),
    start_with_zero: Yup.boolean().required(REQUIRED_TXT),
    reference: Yup.string().required(REQUIRED_TXT),
    display_ranks: Yup.boolean().required(REQUIRED_TXT),
});




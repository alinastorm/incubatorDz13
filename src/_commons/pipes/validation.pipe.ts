import { ValidationPipe, HttpException } from "@nestjs/common"
import { BadRequestException, UnprocessableEntityException } from "@nestjs/common/exceptions"
import { ValidationError } from "@nestjs/common/interfaces/external/validation-error.interface";
import { ArgumentMetadata } from "@nestjs/common/interfaces/features/pipe-transform.interface"
import { HTTP_STATUSES } from "../types/types"


export default new ValidationPipe(
    {
        stopAtFirstError: true,
        forbidUnknownValues: false,
        exceptionFactory: (errors) => {
            const errorsForResponse = []
            errors.forEach((e) => {
                const constraintsKeys = Object.keys(e.constraints)
                constraintsKeys.forEach((ckey) => {
                    errorsForResponse.push({
                        message: e.constraints[ckey],
                        field: e.property
                    })
                })
            })
            return new HttpException(errorsForResponse, HTTP_STATUSES.BAD_REQUEST_400)
        }
    }
)
// class ValidationPipe extends ValidationP {
//     constructor() {
//         super({
//             stopAtFirstError: true,
//             forbidUnknownValues: false
//         })
//     }
//     public async transform(value, metadata: ArgumentMetadata) {
//         try {
//             return await super.transform(value, metadata)
//         } catch (e) {
//             if (e instanceof BadRequestException) {
//                 throw new UnprocessableEntityException(e.message)
//             }
//         }
//     }
// }


// export default new ValidationPipe({
//     transform: true,
//     stopAtFirstError: true,
//     forbidUnknownValues: false,
//     exceptionFactory: (errors: ValidationError[]) => {
//         console.log();
//         new BadRequestException('Validation error')
//     }
// });
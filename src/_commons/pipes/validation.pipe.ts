import { ValidationPipe, HttpException } from "@nestjs/common"
import { HTTP_STATUSES } from "../types/types"

//ValidationPipe использует либу Class validator для проверки типа согласно указанных в классе декораторов
export default new ValidationPipe(
    {
        stopAtFirstError: true,//по одному полю может быть много проверок, остановится на первой
        whitelist: true,//только поля из схемы
        forbidNonWhitelisted: true,//если лишние поля ошибка
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
import { Scalar, CustomScalar } from '@nestjs/graphql';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';

@Scalar('Upload')
export class Upload implements CustomScalar<any, any> {
  description = 'Upload files';

  parseValue(value) {
    return GraphQLUpload.parseValue(value);
  }

  serialize(value) {
    return GraphQLUpload.serialize(value);
  }

  parseLiteral(ast) {
    return GraphQLUpload.parseLiteral(ast, ast.value);
  }
}

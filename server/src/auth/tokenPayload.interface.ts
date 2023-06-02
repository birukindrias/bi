import { Permission } from 'src/authorization/entities/permissions.entity';

interface TokenPayload {
  id: string;
  permissions: Permission;
}

export default TokenPayload;

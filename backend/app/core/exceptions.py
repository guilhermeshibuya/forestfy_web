class DomainException(Exception):
  pass


class InfrastructureException(Exception):
  pass


class NotFoundException(DomainException):
  pass

class ConflictException(DomainException):
  pass

class MLProcessingException(InfrastructureException):
  pass
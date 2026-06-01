import handler from './frog';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function apiHandler(req, res) {
  return handler(req, res);
}

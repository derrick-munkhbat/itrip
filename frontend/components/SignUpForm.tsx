
const SignUpForm: React.FC = () => {
  return (
    <form className="flex flex-col gap-5 justify-center w-2/5">
      <input
        type="text"
        placeholder="enter your email"
        className="flex-1 p-2 border border-gray-300 rounded"
        required
      />
      <input
        type="text"
        placeholder="enter your password"
        className="flex-1 p-2 border border-gray-300 rounded"
        required
      />

      <button type="submit" className="p-2 bg-blue-500 text-white rounded">
        Sign Up
      </button>
    </form>
  );
};

export default SignUpForm;

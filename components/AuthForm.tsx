"use client"

import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type FormType = "sign-in" | "sign-up"

interface SignInFormValues {
  email: string
  password: string
}

interface SignUpFormValues extends SignInFormValues {
  name: string
}

const AuthForm = ({ type }: { type: FormType }) => {
  const isSignIn = type === "sign-in"
  const router = useRouter()
  const form = useForm<SignInFormValues | SignUpFormValues>({
    defaultValues: {
      ...(!isSignIn && { name: "" }),
      email: "",
      password: "",
    },
    mode: "onChange",
  })

  const validateForm = (values: SignInFormValues | SignUpFormValues) => {
    const errors: Record<string, string> = {}

    if (!isSignIn && "name" in values) {
      if (!values.name) {
        errors.name = "Name is required"
      } else if (values.name.length < 2) {
        errors.name = "Name must be at least 2 characters"
      }
    }

    if (!values.email) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Please enter a valid email address"
    }

    if (!values.password) {
      errors.password = "Password is required"
    } else if (values.password.length < 8) {
      errors.password = "Password must be at least 8 characters"
    }

    return errors
  }

  const onSubmit = async (values: SignInFormValues | SignUpFormValues) => {
    try {
      const errors = validateForm(values)

      if (Object.keys(errors).length > 0) {
        Object.entries(errors).forEach(([field, message]) => {
          form.setError(field as any, {
            type: "manual",
            message,
          })
        })
        return
      }

      if (isSignIn) {
        console.log("Sign in:", values)
        // await signIn(values);
      } else {
        console.log("Sign up:", values)
      }
      toast.success(`${isSignIn ? "Successfully signed in" : "Successfully account created"}`)
      router.push("/")
    } catch (error) {
      console.error(error)
      toast.error(`Error: ${error instanceof Error ? error.message : "An unknown error occurred"}`)
    }
  }

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" height={32} width={38} />
          <h2 className="text-primary-100">PrepWise</h2>
        </div>

        <h3>Practice job interviews with AI</h3>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4">
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Name" type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Your email address" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="btn" type="submit" disabled={form.formState.isSubmitting}>
              {isSignIn ? "Sign In" : "Create an Account"}
            </Button>
          </form>
        </Form>

        <p className="text-center">
          {isSignIn ? "No account yet?" : "Have an account already?"}
          <Link href={isSignIn ? "/sign-up" : "/sign-in"} className="font-bold text-user-primary ml-1">
            {isSignIn ? "Sign Up" : "Sign In"}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default AuthForm

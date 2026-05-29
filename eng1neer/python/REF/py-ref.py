# defining funcion 
def area_triangle(base, height):
  return base*height/2;

area_a = area_triangle(5,4)
area_b = area_triangle(7,3)
Sum = area_a + area_b
print("The sum of both areas is: " + str(sum))

def convert_seconds(seconds):
  hours = seconds // 3600
  minutes = (seconds - hours * 3600) // 60
  remaining_seconds = seconds - hours * 3600 - minutes * 60
  return hours, minutes, remaining_seconds

hours, minutes, seconds = convert_seconds(5000)
print(hours, minutes, seconds)

# golden ratio
ratio = ((1+(5**(1/2)))/2)
print(ratio)

# bill pay
total = 2048 + 4357 + 97658 + 125 + 8
files = 5
average = total / files
print("The average size is: " + str(average))

bill = 47.28
tip = bill * 0.15
total = bill + tip
share = total/2 
print("Each person needs to pay: " + str(share))


# 1) Complete the function to return the result of the conversion
def convert_distance(miles):
    km = miles * 1.6  # approximately 1.6 km in 1 mile
    return km
my_trip_miles = 55

# 2) Convert my_trip_miles to kilometers by calling the function above
my_trip_km = convert_distance(my_trip_miles)

# 3) Fill in the blank to print the result of the conversion
print("The distance in kilometers is " + str(my_trip_km))

# 4) Calculate the round-trip in kilometers by doubling the result, and fill in the blank
print("The round-trip in kilometers is " + str(my_trip_km*2))

# This function compares two numbers and returns them in increasing order.
def order_numbers(number1, number2):
    if number2 > number1:
        return number1, number2
    else:
        return number2, number1

# 1) Fill in the blanks so the print statement displays the result of the function call
smaller, bigger = order_numbers(100, 99)
print(smaller, bigger)

def lucky_number(name):
  number = len(name) * 9
  ans = "Hello " + name + ". Your lucky number is " + str(number)
  return ans
      
print(lucky_number("Kay"))
print(lucky_number("Cameron"))

# comparison operators
def is_positive(number):
  if number > 0:
    return True

def calculate_storage(filesize):
    block_size = 4096
    # Use floor division to calculate how many blocks are fully occupied
    full_blocks = filesize // block_size
    # Use the modulo operator to check whether there's any remainder
    partial_block_remainder = filesize % block_size
    # Depending on whether there's a remainder or not, return
    # the total number of bytes required to allocate enough blocks
    # to store your data.
    if partial_block_remainder > 0:
        return (1+full_blocks)*block_size
    return full_blocks*block_size

print(calculate_storage(1))    # Should be 4096
print(calculate_storage(4096)) # Should be 4096
print(calculate_storage(4097)) # Should be 8192
print(calculate_storage(6000)) # Should be 8192

# color translator
def color_translator(color):
    if color == "red":
        hex_color = "#ff0000"
    elif color == "green":
        hex_color = "#00ff00"
    elif color == "blue":
        hex_color = "#0000ff"
    else:
        hex_color = "unknown"
    return hex_color

# name formatter
print(color_translator("blue")) # Should be #0000ff
print(color_translator("yellow")) # Should be unknown
print(color_translator("red")) # Should be #ff0000
print(color_translator("black")) # Should be unknown
print(color_translator("green")) # Should be #00ff00
print(color_translator("")) # Should be unknown 

# exam grading
def exam_grade(score):
    if score > 95:
        grade = "Top Score"
    elif score >= 60:
        grade = "Pass"
    else:
        grade = "Fail"
    return grade

print(exam_grade(65)) # Should be Pass
print(exam_grade(55)) # Should be Fail
print(exam_grade(60)) # Should be Pass
print(exam_grade(95)) # Should be Pass
print(exam_grade(100)) # Should be Top Score
print(exam_grade(0)) # Should be Fail


def format_name(first_name, last_name):
    # code goes here
    string = "Name: " + last_name + ", " + first_name
    if last_name == "":
        string = "Name: " + first_name
    if first_name == "":
        string = "Name: " + last_name
    if first_name == "" and last_name == "":
        string = ""
    else:
        return string 

print(format_name("Ernest", "Hemingway"))
# Should return the string "Name: Hemingway, Ernest"

print(format_name("", "Madonna"))
# Should return the string "Name: Madonna"

print(format_name("Voltaire", ""))
# Should return the string "Name: Voltaire"

print(format_name("", ""))
# Should return an empty string

# print longest word
def longest_word(word1, word2, word3):
    if len(word1) >= len(word2) and len(word1) >= len(word3):
        word = word1
    elif len(word2) >= len(word3):
        word = word2
    else:
        word = word3
    return(word)

print(longest_word("chair", "couch", "table"))
print(longest_word("bed", "bath", "beyond"))
print(longest_word("laptop", "notebook", "desktop"))


# The fractional_part function divides the numerator by the denominator, and returns just the fractional part (a number between 0 and 1). 
# Complete the body of the function so that it returns the right number.
from fractions import Fraction
def fractional_part(numerator, denominator):
    # Operate with numerator and denominator to 
    if numerator == 0 or denominator == 0 or numerator == denominator:
        return 0
    else:
        return (numerator%denominator)/denominator

print(fractional_part(5, 5)) # Should be 0
print(fractional_part(5, 4)) # Should be 0.25
print(fractional_part(5, 3)) # Should be 0.66...
print(fractional_part(5, 2)) # Should be 1.5
print(fractional_part(5, 0)) # Should be 0
print(fractional_part(0, 5)) # Should be 0


# while loops
def attempts(n):
    x = 1
    while x <= n:
        print("Attempt " + str(x))
        x += 1
    print("Done")
    
attempts(5)

def count_down(start_number):
  current = start_number
  while (current > 0):
    print(current)
    current -= 1
  print("Zero!")

count_down(3)


def print_range(start, end):
    # Loop through the numbers from start to end
    n = start
    while n <= end:
        print(n)
        n += 1

print_range(1, 5)


# Fill in the blanks to make the print_prime_factors function print all the prime factors of a number. 
# A prime factor is a number that is prime and divides another without a remainder.
def print_prime_factors(number):
  # Start with two, which is the first prime
  factor = 2
  # Keep going until the factor is larger than the number
  while factor <= number:
    # Check if factor is a divisor of number
    if number % factor == 0:
      # If it is, print it and divide the original number
      print(factor)
      number = number / factor
    else:
      # If it's not, increment the factor by one
      factor += 1
  return "Done"

print_prime_factors(100)
# Should print 2,2,5,5
# DO NOT DELETE THIS COMMENT

def is_power_of_two(n):
  # Check if the number can be divided by two without a remainder
  if n == 0:
    return False
  while n % 2 == 0:
    n = n / 2
  # If after dividing by two the number is 1, it's a power of two
  if n == 1:
    return True
  return False
  
print(is_power_of_two(0)) # Should be False
print(is_power_of_two(1)) # Should be True
print(is_power_of_two(8)) # Should be True
print(is_power_of_two(9)) # Should be False

def sum_divisors(n):
  sum = 1
  div = 2
  
  if n == 0:
    return 0
  
  while div < n/2+1:
    if n % div == 0:
      sum += div
    div += 1
  # Return the sum of all divisors of n, not including n
  return sum

print(sum_divisors(0))
# 0
print(sum_divisors(3)) # Should sum of 1
# 1
print(sum_divisors(36)) # Should sum of 1+2+3+4+6+9+12+18
# 55
print(sum_divisors(102)) # Should be sum of 2+3+6+17+34+51
# 114

def multiplication_table(number):
    # Initialize the starting point of the multiplication table
    multiplier = 1
    # Only want to loop through 5
    while multiplier <= 5:
        result = number*multiplier 
        # What is the additional condition to exit out of the loop?
        if result > 25:
            break
        print(str(number) + "x" + str(multiplier) + "=" + str(result))
        # Increment the variable for the loop
        multiplier += 1

multiplication_table(3) 
# Should print: 3x1=3 3x2=6 3x3=9 3x4=12 3x5=15

multiplication_table(5) 
# Should print: 5x1=5 5x2=10 5x3=15 5x4=20 5x5=25

multiplication_table(8) 
# Should print: 8x1=8 8x2=16 8x3=24

for left in range(7):
    for right in range(left, 7):
        print("[" + str(left) + "|" + str(right) + "]", end=" ")
    print()

teams = [ 'Dragons', 'Wolves', 'Pandas', 'Unicorns']
for home_team in teams:
    for away_team in teams:
        if home_team != away_team:
            print(home_team + " vs " + away_team)

# factoral
def factorial(n):
    result = 1
    for x in range(2,n+1):
        result *= x
    return result

for n in range(10):
    print(n, factorial(n))

for x in range(1,11):
  print(x**3)

for i in range(0, 101, 7):
    print(i)

# retry
def retry(operation, attempts):
  for n in range(attempts):
    if operation():
      print("Attempt " + str(n) + " succeeded")
      break
    else:
      print("Attempt " + str(n) + " failed")

retry(create_user, 3)
retry(stop_service, 5)

# recursion
def sum_positive_numbers(n):
  sum = 0
  if n == 1:
    return 1
  else:
    sum += n + sum_positive_numbers(n-1)
    
  return sum

print(sum_positive_numbers(3)) # Should be 6
print(sum_positive_numbers(5)) # Should be 15

def recursive_function(parameters):
    if base_case_condition(parameters):
        return base_case_value
    recursive_function(modified_parameters)


def is_power_of(number, base):
  # Base case: when number is smaller than base.
  if number < base:
    # If number is equal to 1, it's a power (base**0).
    return number == 1

  # Recursive case: keep dividing number by base.
  return is_power_of(number/base, base)

print(is_power_of(8,2)) # Should be True
print(is_power_of(64,4)) # Should be True
print(is_power_of(70,10)) # Should be False


def count_users(group):
  count = 0
  for member in get_members(group):
    count += 1
    if is_group(member):
      count += count_users(member) - 1
  return count

print(count_users("sales")) # Should be 3
print(count_users("engineering")) # Should be 8
print(count_users("everyone")) # Should be 18

# print 1 - 7
number = 1
while number <= 7:
    print(number, end=" ")
    number += 1

def show_letters(word):
    for letter in word:
        print(letter)

show_letters("Hello")
# Should print one line per letter


import math
def digits(n):
    count = 0
    if n == 0:
      return 1
    while (n>0):
        count += 1
        n = math.floor(n/10)
    return count
    
print(digits(25))   # Should print 2
print(digits(144))  # Should print 3
print(digits(1000)) # Should print 4
print(digits(0))    # Should print 1


def multiplication_table(start, stop):
    for x in range(start, stop+1):
        for y in range(start, stop+1):
            print(str(x*y), end=" ")
        print()

multiplication_table(1, 3)



def counter(start, stop):
    x = start
    if start > stop:
        return_string = "Counting down: "
        while x >= stop:
            return_string += str(x)
            if x != stop:
                return_string += ","
            x -= 1
    else:
        return_string = "Counting up: "
        while x <= stop:
            return_string += str(x)
            if x != stop:
                return_string += ","
            x += 1
    return return_string

print(counter(1, 10)) # Should be "Counting up: 1,2,3,4,5,6,7,8,9,10"
print(counter(2, 1)) # Should be "Counting down: 2,1"
print(counter(5, 5)) # Should be "Counting up: 5"

def even_numbers(maximum):
    return_string = ""
    for x in range(2, maximum+1, 2):
        return_string += str(x) + " "
    return return_string.strip()

print(even_numbers(6))  # Should be 2 4 6
print(even_numbers(10)) # Should be 2 4 6 8 10
print(even_numbers(1))  # No numbers displayed
print(even_numbers(3))  # Should be 2
print(even_numbers(0))  # No numbers displayed


def double_word(word):
    return word*2 + str(len(word*2))

print(double_word("hello")) # Should return hellohello10
print(double_word("abc"))   # Should return abcabc6
print(double_word(""))      # Should return 0


def replace_domain(email, old_domain, new_domain):
    if "@" + old_domain in email:
        index = email.index("@" + old_domain)
        new_email = email[:index] + "@" + new_domain
        return new_email
    return email


def student_grade(name, grade):
    return "{} reveived {}%".format(name, grade)

print(student_grade("Reed", 80))
print(student_grade("Paige", 92))
print(student_grade("Jesse", 85))


def to_celsius(x):
    return (x-32)*5/9

for x in range(0, 101, 10):
    print("{:>3} F | {:>6.2f} C".format(x, to_celsius(x)))


def is_palindrome(input_string):
	# We'll create two strings, to compare them
	new_string = ""
	reverse_string = ""
	# Traverse through each letter of the input string
	for letter in input_string:
		# Add any non-blank letters to the 
		# end of one string, and to the front
		# of the other string. 
		if letter != " ":
			new_string += letter.lower() 
			reverse_string = letter.lower() + reverse_string
	# Compare the strings
	
	if new_string == reverse_string:
		return True
	return False

print(is_palindrome("Never Odd or Even")) # Should be True
print(is_palindrome("abc")) # Should be False
print(is_palindrome("kayak")) # Should be True


def convert_distance(miles):
	km = miles * 1.6 
	result = "{} miles equals {:.1f} km".format(miles,km)
	return result

print(convert_distance(12)) # Should be: 12 miles equals 19.2 km
print(convert_distance(5.5)) # Should be: 5.5 miles equals 8.8 km
print(convert_distance(11)) # Should be: 11 miles equals 17.6 km

def nametag(first_name, last_name):
	return("{} {}.".format(first_name, last_name[0]))

print(nametag("Jane", "Smith")) 
# Should display "Jane S." 
print(nametag("Francesco", "Rinaldi")) 
# Should display "Francesco R." 
print(nametag("Jean-Luc", "Grand-Pierre")) 
# Should display "Jean-Luc G." 

def replace_ending(sentence, old, new):
	# Check if the old string is at the end of the sentence 
	if old[:] == sentence[-len(old):]:
		# Using i as the slicing index, combine the part
		# of the sentence up to the matched string at the 
		# end with the new string
		i = len(old)
		new_sentence = sentence[:-i] + new
		return new_sentence

	# Return the original sentence if there is no match 
	return sentence
	
print(replace_ending("It's raining cats and cats", "cats", "dogs")) 
# Should display "It's raining cats and dogs"
print(replace_ending("She sells seashells by the seashore", "seashells", "donuts")) 
# Should display "She sells seashells by the seashore"
print(replace_ending("The weather is nice in May", "may", "april")) 
# Should display "The weather is nice in May"
print(replace_ending("The weather is nice in May", "May", "April")) 
# Should display "The weather is nice in April"


filenames = ["program.c", "stdio.hpp", "sample.hpp", "a.out", "math.hpp", "hpp.out"]
newfilenames = []
for file in filenames:
  if '.hpp' in file:
    newfilenames.append((file,file[:-2]))
  else:
    newfilenames.append((file,file))

print (newfilenames) # Should be [('program.c', 'program.c'), ('stdio.hpp', 'stdio.h'), ('sample.hpp', 'sample.h'), ('a.out', 'a.out'), ('math.hpp', 'math.h'), ('hpp.out', 'hpp.out')]


     
[('program.c', 'program.c'), ('stdio.hpp', 'stdio.h'), ('sample.hpp', 'sample.h'), ('a.out', 'a.out'), ('math.hpp', 'math.h'), ('hpp.out', 'hpp.out')]

def octal_to_string(octal):
    result = ""
    value_letters = [(4,"r"),(2,"w"),(1,"x")]
    # Iterate over each of the digits in octal
    for digit in [int(n) for n in str(octal)]:
        # Check for each of the permissions values
        for value, letter in value_letters:
            if digit >= value:
                result += letter
                digit -= value
            else:
                result += '-'
    return result
    
print(octal_to_string(755)) # Should be rwxr-xr-x
print(octal_to_string(644)) # Should be rw-r--r--
print(octal_to_string(750)) # Should be rwxr-x---
print(octal_to_string(600)) # Should be rw-------


def pig_latin(text):
  say = ""
  # Separate the text into words
  words = text.split()
  for word in words:
    # Create the pig latin word and add it to the list
    say += word[1:]+word[0]+'ay'
    if word != words[len(words)-1]:
      say +=' '
    # Turn the list back into a phrase
  return say
		
print(pig_latin("hello how are you")) # Should be "ellohay owhay reaay ouyay"
print(pig_latin("programming in python is fun")) # Should be "rogrammingpay niay ythonpay siay unfay"


def format_address(address_string):
  # Declare variables
  words = address_string.split()
  num = ""
  nam = ""
  # Separate the address string into parts

  # Traverse through the address parts
  for i,word in enumerate(words):
    if i == 0:
      num += word
    elif i != len(words)-1:
      nam += word +" "
    else:
      nam += word
    # Determine if the address part is the
    # house number or part of the street name

  # Does anything else need to be done 
  # before returning the result?
  
  # Return the formatted string  
  return "house number {} on street named {}".format(num,nam)

print(format_address("123 Main Street"))
# Should print: "house number 123 on street named Main Street"

print(format_address("1001 1st Ave"))
# Should print: "house number 1001 on street named 1st Ave"

print(format_address("55 North Center Drive"))
# Should print "house number 55 on street named North Center Drive"

def highlight_word(sentence, word):
  ret = ""
  l = len(word)
  words = sentence.split()
  for i,w in enumerate(words):
    if w[:l] == word:
      ret += w[:l].upper()+w[l:]
    else:
      ret += w
    if i != len(words)-1:
      ret += " "
  return ret

print(highlight_word("Have a nice day", "nice"))
print(highlight_word("Shhh, don't be so loud!", "loud"))
print(highlight_word("Automating with Python is fun", "fun"))


def count_letters(text):
  result = {}
  # Go through each letter in the text
  for letter in text:
    # Check if the letter needs to be counted or not
    letter = letter.lower()
    if letter.isalpha():
      if letter in result:
        result[letter] += 1
      else:
        result[letter] = 1
    # Add or increment the value in the dictionary
  return result

print(count_letters("AaBbCc"))
# Should be {'a': 2, 'b': 2, 'c': 2}

print(count_letters("Math is fun! 2+2=4"))
# Should be {'m': 1, 'a': 1, 't': 1, 'h': 1, 'i': 1, 's': 1, 'f': 1, 'u': 1, 'n': 1}

print(count_letters("This is a sentence."))
# Should be {'t': 2, 'h': 1, 'i': 2, 's': 3, 'a': 1, 'e': 3, 'n': 2, 'c': 1}



def get_event_date(event):
  return event.date

def current_users(events):
  events.sort(key=get_event_date)
  machines = {}
  for event in events:
    if event.machine not in machines:
      machines[event.machine] = set()
    if event.type == "login":
      machines[event.machine].add(event.user)
    elif event.type == "logout" and event.user in machines[event.machine]:
      machines[event.machine].remove(event.user)
  return machines

def generate_report(machines):
  for machine, users in machines.items():
    if len(users) > 0:
      user_list = ", ".join(users)
      print("{}: {}".format(machine, user_list))

class Event:
  def __init__(self, event_date, event_type, machine_name, user):
    self.date = event_date
    self.type = event_type
    self.machine = machine_name
    self.user = user
